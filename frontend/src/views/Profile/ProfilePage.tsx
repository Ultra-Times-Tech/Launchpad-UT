import {useState, useEffect, useRef} from 'react'
import useAlerts from '../../hooks/useAlert'
import {useUltraWallet} from '../../utils/ultraWalletHelper'
import {apiRequestor} from '../../utils/axiosInstanceHelper'
import {Uniq} from '../../utils/uniqService'
import NftSelector from '../../components/UniqSelector'
import useUserAvatar, {refreshUserAvatar, clearAvatarCache} from '../../hooks/useUserAvatar'
import {useTranslation} from '../../contexts/TranslationContext'

interface ProfileData {
  email: string
  username: string | null
  emailNotifications: boolean
  marketingCommunications: boolean
  avatarNftId: string | null
  walletAddress: string
}

function ProfilePage() {
  const {blockchainId, signTransaction, isLoading: isWalletLoading, error: walletError} = useUltraWallet()
  const {success, error: showError} = useAlerts()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [selectedNft, setSelectedNft] = useState<Uniq | null>(null)
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false)
  const {imageUrl: avatarImage, isLoading: isLoadingAvatar, avatarNftId, updateLocalAvatar, refreshAvatar} = useUserAvatar(blockchainId)
  const avatarModalRef = useRef<HTMLDivElement>(null)
  const [profile, setProfile] = useState<ProfileData>({
    email: 'user@example.com',
    username: null,
    emailNotifications: false,
    marketingCommunications: false,
    avatarNftId: null,
    walletAddress: '',
  })
  const [newEmail, setNewEmail] = useState(profile.email)
  const [newUsername, setNewUsername] = useState(profile.username || '')
  const [usernameValid, setUsernameValid] = useState(true)
  const {t} = useTranslation()

  // Fonction pour traduire les messages d'erreur du wallet
  const translateWalletError = (error: string | null): string => {
    if (!error) return t('transaction_failed')

    const lowerError = error.toLowerCase()
    if (lowerError.includes('rejected') || lowerError.includes('refused')) {
      return t('transaction_rejected')
    }
    if (lowerError.includes('not connected')) {
      return t('wallet_not_connected')
    }
    if (lowerError.includes('not installed')) {
      return t('ultra_wallet_not_available')
    }
    return t('transaction_failed')
  }

  // Gérer la fermeture de la popup en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isAvatarModalOpen && avatarModalRef.current && !avatarModalRef.current.contains(event.target as Node)) {
        setIsAvatarModalOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isAvatarModalOpen])

  // Forcer le rechargement de l'avatar au chargement de la page
  useEffect(() => {
    if (blockchainId) {
      // Vider le cache pour forcer un rechargement frais
      clearAvatarCache(blockchainId)
      refreshAvatar()
    }
  }, [blockchainId])

  // Mettre à jour avatarNftId dans le profil quand il change dans le hook
  useEffect(() => {
    if (avatarNftId !== profile.avatarNftId) {
      setProfile(prev => ({
        ...prev,
        avatarNftId,
      }))
    }
  }, [avatarNftId, profile.avatarNftId])

  useEffect(() => {
    const fetchUserData = async () => {
      if (blockchainId) {
        try {
          const response = await apiRequestor.get(`/users/wallets/${blockchainId}`)

          if (response.data && response.data.data && response.data.data.length > 0) {
            const userData = response.data.data[0].attributes

            // Convertir sendnotif qui peut être un array ['1'] ou un objet {1: "Yes"}
            let emailNotif = false
            if (Array.isArray(userData.sendnotif)) {
              emailNotif = userData.sendnotif.includes('1')
            } else if (typeof userData.sendnotif === 'object' && userData.sendnotif !== null) {
              // Si le format est {1: "Yes"}, vérifier si la clé 1 existe et a une valeur
              emailNotif = !!userData.sendnotif['1']
            }

            // Convertir sendcomm qui peut être un array ['1'] ou un objet {1: "Yes"}
            let marketingComm = false
            if (Array.isArray(userData.sendcomm)) {
              marketingComm = userData.sendcomm.includes('1')
            } else if (typeof userData.sendcomm === 'object' && userData.sendcomm !== null) {
              // Si le format est {1: "Yes"}, vérifier si la clé 1 existe et a une valeur
              marketingComm = !!userData.sendcomm['1']
            }

            setProfile({
              username: userData.username || '',
              email: userData.email || '',
              walletAddress: blockchainId,
              emailNotifications: emailNotif,
              marketingCommunications: marketingComm,
              avatarNftId: userData.avatarNftId || null,
            })
          } else {
            setProfile({
              username: '',
              email: '',
              walletAddress: blockchainId,
              emailNotifications: false,
              marketingCommunications: false,
              avatarNftId: null,
            })
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error)
          showError(t('profile_fetch_error'))
        }
      }
    }

    // Attendre que le blockchainId soit défini avant de faire les appels API
    if (blockchainId) {
      fetchUserData()
    }
  }, [blockchainId])

  // Vérifier la validité du nom d'utilisateur
  useEffect(() => {
    setUsernameValid(newUsername.trim().length >= 3 || newUsername.trim().length === 0)
  }, [newUsername])

  const handleSave = async () => {
    try {
      if (!blockchainId) {
        showError(t('wallet_connection_required'))
        return
      }

      // Récupérer d'abord l'ID utilisateur à partir du wallet
      const userResponse = await apiRequestor.get(`/users/wallets/${blockchainId}`)
      if (!userResponse.data || !userResponse.data.data || userResponse.data.data.length === 0) {
        throw new Error(t('user_not_found'))
      }

      const userId = userResponse.data.data[0].id
      const userData = userResponse.data.data[0].attributes

      // Mettre à jour l'email en base de données avec toutes les informations nécessaires
      await apiRequestor.patch(`/users/${userId}`, {
        name: userData.name || '',
        username: userData.username || '',
        email: newEmail,
        block: userData.block || '0',
        groups: userData.groups || ['2'],
        // Préserver les wallets existants
        wallets: userData.wallets || {},
        // Envoyer les notifications au format tableau ["0"] ou ["1"]
        sendnotif: [profile.emailNotifications ? '1' : '0'],
        sendcomm: [profile.marketingCommunications ? '1' : '0'],
      })

      // Mettre à jour l'état local après confirmation du serveur
      setProfile(prev => ({
        ...prev,
        email: newEmail,
      }))

      setIsEditing(false)
      success(t('email_update_success'))
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'email:", error)
      showError(t('email_update_error'))
    }
  }

  const handleSaveUsername = async () => {
    if (!blockchainId) {
      showError(t('blockchain_id_missing'))
      return
    }

    const trimmedUsername = newUsername.trim()

    if (trimmedUsername.length < 3) {
      showError(t('username_length_error'))
      return
    }

    const txObject = {
      action: 'updatename',
      contract: 'ultra.avatar',
      data: {
        account: blockchainId,
        username: trimmedUsername,
      },
    }

    try {
      const response = await signTransaction(txObject)

      if (response && response.data?.transactionHash) {
        setProfile(prev => ({
          ...prev,
          username: trimmedUsername || null,
        }))
        setNewUsername(trimmedUsername)
        setIsEditingUsername(false)
        success(t('username_update_success'))
      } else {
        // Utiliser le message d'erreur du wallet s'il existe, sinon utiliser le message par défaut
        showError(translateWalletError(walletError))
        console.error('Transaction failed or was declined:', response, walletError)
      }
    } catch (err) {
      console.error('Error during signTransaction process:', err)
      showError(t('unexpected_username_error'))
    }
  }

  const handleSaveAvatar = async () => {
    if (!blockchainId || !selectedNft) {
      showError(t('nft_missing'))
      return
    }

    setIsUpdatingAvatar(true)

    try {
      // Extraire l'URL de l'image du NFT sélectionné
      const imageUrl = selectedNft.metadata.content.medias.square?.uri || selectedNft.metadata.content.medias.product?.uri || selectedNft.metadata.content.medias.gallery?.uri || selectedNft.metadata.content.medias.hero?.uri

      // Mettre à jour l'avatar localement AVANT la transaction blockchain
      // pour une mise à jour visuelle immédiate
      updateLocalAvatar(selectedNft.id, imageUrl)

      const txObject = {
        action: 'setavatar',
        contract: 'ultra.avatar',
        data: {
          user: blockchainId,
          nft_id: parseInt(selectedNft.id),
        },
      }

      const response = await signTransaction(txObject)

      if (response && response.data?.transactionHash) {
        if (blockchainId) {
          refreshUserAvatar(blockchainId)
        }

        setIsAvatarModalOpen(false)
        success(t('avatar_update_success'))
      } else {
        // En cas d'échec, on réinitialise l'avatar à sa valeur précédente
        if (blockchainId) {
          refreshUserAvatar(blockchainId)
        }
        showError(translateWalletError(walletError))
        console.error('Transaction failed or was declined:', response, walletError)
      }
    } catch (err) {
      // En cas d'erreur, réinitialiser l'avatar depuis le serveur
      if (blockchainId) {
        refreshUserAvatar(blockchainId)
      }
      console.error('Error during avatar update process:', err)
      showError(t('unexpected_avatar_error'))
    } finally {
      setIsUpdatingAvatar(false)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!blockchainId) {
      showError(t('blockchain_id_missing'))
      return
    }

    setIsRemovingAvatar(true)

    try {
      const txObject = {
        action: 'clearavatar',
        contract: 'ultra.avatar',
        data: {
          user: blockchainId,
        },
      }

      const response = await signTransaction(txObject)

      if (response && response.data?.transactionHash) {
        updateLocalAvatar(null)
        if (blockchainId) {
          refreshUserAvatar(blockchainId)
        }

        success(t('avatar_remove_success'))
      } else {
        // Utiliser le message d'erreur du wallet s'il existe, sinon utiliser le message par défaut
        showError(translateWalletError(walletError))
        console.error('Transaction failed or was declined:', response, walletError)
      }
    } catch (err) {
      // En cas d'erreur, réinitialiser l'avatar
      if (blockchainId) {
        refreshUserAvatar(blockchainId)
      }
      console.error('Error during avatar removal process:', err)
      showError(t('unexpected_avatar_remove_error'))
    } finally {
      setIsRemovingAvatar(false)
    }
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(blockchainId || '')
      success(t('wallet_copy_success'))
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const handleToggleEmailNotifications = async () => {
    try {
      if (!blockchainId) {
        showError(t('wallet_connection_required'))
        return
      }

      const newValue = !profile.emailNotifications

      // Mettre à jour l'interface immédiatement pour une meilleure réactivité
      setProfile(prev => ({
        ...prev,
        emailNotifications: newValue,
      }))

      // Récupérer d'abord l'ID utilisateur à partir du wallet
      const userResponse = await apiRequestor.get(`/users/wallets/${blockchainId}`)
      if (!userResponse.data || !userResponse.data.data || userResponse.data.data.length === 0) {
        throw new Error('Utilisateur non trouvé')
      }

      const userId = userResponse.data.data[0].id
      const userData = userResponse.data.data[0].attributes

      // Créer l'objet avec le format exact requis par l'API
      const updateData = {
        name: userData.name || '',
        username: userData.username || '',
        email: userData.email || '',
        block: userData.block || '0',
        groups: userData.groups || ['2'],
        // Préserver les wallets existants
        wallets: userData.wallets || {},
        // Envoyer sendnotif et sendcomm au format tableau
        sendnotif: [newValue ? "1" : "0"],
        sendcomm: [profile.marketingCommunications ? "1" : "0"],
      }

      // Mettre à jour la préférence en base de données
      await apiRequestor.patch(`/users/${userId}`, updateData)

      // Afficher la confirmation après succès
      success(t(profile.emailNotifications ? 'notifications_disabled' : 'notifications_enabled'))
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error)
      showError(t('notifications_update_error'))

      // Restaurer l'état précédent en cas d'erreur
      setProfile(prev => ({
        ...prev,
        emailNotifications: !prev.emailNotifications,
      }))
    }
  }

  const handleToggleMarketingCommunications = async () => {
    try {
      if (!blockchainId) {
        showError(t('wallet_connection_required'))
        return
      }

      const newValue = !profile.marketingCommunications

      // Mettre à jour l'interface immédiatement pour une meilleure réactivité
      setProfile(prev => ({
        ...prev,
        marketingCommunications: newValue,
      }))

      // Récupérer d'abord l'ID utilisateur à partir du wallet
      const userResponse = await apiRequestor.get(`/users/wallets/${blockchainId}`)
      if (!userResponse.data || !userResponse.data.data || userResponse.data.data.length === 0) {
        throw new Error('Utilisateur non trouvé')
      }

      const userId = userResponse.data.data[0].id
      const userData = userResponse.data.data[0].attributes

      // Créer l'objet avec le format exact requis par l'API
      const updateData = {
        name: userData.name || '',
        username: userData.username || '',
        email: userData.email || '',
        block: userData.block || '0',
        groups: userData.groups || ['2'],
        // Préserver les wallets existants
        wallets: userData.wallets || {},
        // Envoyer sendnotif et sendcomm au format tableau
        sendnotif: [profile.emailNotifications ? '1' : '0'],
        sendcomm: [newValue ? '1' : '0'],
      }

      // Mettre à jour la préférence en base de données
      await apiRequestor.patch(`/users/${userId}`, updateData)

      // Afficher la confirmation après succès
      success(t(profile.marketingCommunications ? 'marketing_disabled' : 'marketing_enabled'))
    } catch (error) {
      console.error('Erreur lors de la mise à jour des communications marketing:', error)
      showError(t('communications_update_error'))

      // Restaurer l'état précédent en cas d'erreur
      setProfile(prev => ({
        ...prev,
        marketingCommunications: !prev.marketingCommunications,
      }))
    }
  }

  const handleSelectNft = (nft: Uniq) => {
    setSelectedNft(nft)
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-3xl font-bold text-primary-300 mb-2'>{t('profile_title')}</h1>
          <p className='text-gray-600 mb-8'>{t('profile_subtitle')}</p>

          <div className='bg-dark-800 rounded-xl p-6 shadow-lg'>
            {/* Profile Avatar */}
            <div className='flex items-center space-x-4 mb-8'>
              <div className='relative w-20 h-20 cursor-pointer' onClick={() => setIsAvatarModalOpen(true)}>
                {/* Fond circulaire */}
                <div className='absolute inset-0 rounded-full bg-dark-900 z-0'></div>

                {/* Bordure fixe */}
                <div className='absolute inset-0 rounded-full border-[2px] border-primary-500/50 z-10'></div>

                {/* Effet d'intensité lumineuse défilant */}
                <div className='absolute inset-0 rounded-full overflow-hidden z-20'>
                  <div className='absolute inset-0 animate-light-sweep'></div>
                </div>

                {/* Contenu */}
                <div className='absolute inset-[2px] rounded-full flex items-center justify-center overflow-hidden bg-dark-900 z-30'>
                  {isLoadingAvatar ? (
                    <div className='animate-pulse w-full h-full bg-primary-600/50'></div>
                  ) : profile.avatarNftId && avatarImage ? (
                    <img src={avatarImage} alt='Avatar' className='w-full h-full object-cover' />
                  ) : (
                    <svg className='w-10 h-10 text-white' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                    </svg>
                  )}
                </div>

                {/* Indicateur d'édition */}
                <div className='absolute bottom-1 right-1 bg-primary-500 rounded-full p-1 z-40 shadow-md'>
                  <svg className='w-3 h-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className='text-xl font-semibold'>{t('profile_your_profile')}</h2>
                <p className='text-gray-400 text-sm'>{t('profile_manage_settings')}</p>
                <div className='mt-2 space-x-2'>
                  <button onClick={() => setIsAvatarModalOpen(true)} className='px-3 py-1 bg-primary-600 text-sm text-white rounded-lg hover:bg-primary-700 transition-colors'>
                    {t('change_avatar')}
                  </button>
                  {profile.avatarNftId && (
                    <button onClick={handleRemoveAvatar} disabled={isRemovingAvatar} className={`px-3 py-1 bg-red-600 text-sm text-white rounded-lg transition-colors ${isRemovingAvatar ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}>
                      {isRemovingAvatar ? t('removing_avatar') : t('remove_avatar')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Username */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-400 mb-2'>{t('username')}</label>
              {isEditingUsername ? (
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <div className='relative w-full'>
                      <input type='text' value={newUsername} onChange={e => setNewUsername(e.target.value)} className={`w-full px-4 py-2 bg-dark-900 border rounded-lg text-white focus:outline-none focus:border-primary-500 ${!usernameValid ? 'border-red-500' : 'border-dark-700'}`} placeholder={t('username_placeholder')} />
                      {!usernameValid && newUsername.trim().length > 0 && (
                        <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500'>
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                          </svg>
                        </div>
                      )}
                    </div>
                    <button onClick={handleSaveUsername} disabled={isWalletLoading || !usernameValid || newUsername.trim().length < 3} className={`px-4 py-2 bg-primary-500 text-white rounded-lg transition-colors ${isWalletLoading || !usernameValid || newUsername.trim().length < 3 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'}`}>
                      {isWalletLoading ? t('saving') : t('save')}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false)
                        setNewUsername(profile.username || '')
                      }}
                      disabled={isWalletLoading}
                      className={`px-4 py-2 bg-dark-700 text-white rounded-lg transition-colors ${isWalletLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark-600'}`}>
                      {t('cancel')}
                    </button>
                  </div>
                  <p className='text-xs text-gray-400'>{t('username_min_length')}</p>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <input type='text' value={profile.username || ''} disabled placeholder={t('username_placeholder')} className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-300 focus:outline-none' />
                  <button onClick={() => setIsEditingUsername(true)} className='px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                    {t('edit')}
                  </button>
                </div>
              )}
            </div>

            {/* Wallet Address */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-400 mb-2'>{t('wallet_address')}</label>
              <div className='flex items-center space-x-2'>
                <div className='flex-1 px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-300'>{blockchainId}</div>
                <button onClick={handleCopyAddress} className='px-3 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                  {t('copy')}
                </button>
              </div>
            </div>

            {/* Email */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-400 mb-2'>{t('email')}</label>
              {isEditing ? (
                <div className='flex items-center space-x-2'>
                  <input type='email' value={newEmail} onChange={e => setNewEmail(e.target.value)} className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500' placeholder={t('email_placeholder')} />
                  <button onClick={handleSave} className='px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors'>
                    {t('save')}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setNewEmail(profile.email)
                    }}
                    className='px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                    {t('cancel')}
                  </button>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <input type='email' value={profile.email} disabled className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-300 focus:outline-none' />
                  <button onClick={() => setIsEditing(true)} className='px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                    {t('edit')}
                  </button>
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-primary-300'>{t('preferences')}</h3>
              <div className='flex items-center justify-between py-3 border-b border-dark-700'>
                <div>
                  <h4 className='font-medium'>{t('email_notifications')}</h4>
                  <p className='text-sm text-gray-400'>{t('email_notifications_description')}</p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' checked={profile.emailNotifications} onChange={handleToggleEmailNotifications} className='sr-only peer' />
                  <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              <div className='flex items-center justify-between py-3 border-b border-dark-700'>
                <div>
                  <h4 className='font-medium'>{t('marketing_communications')}</h4>
                  <p className='text-sm text-gray-400'>{t('marketing_communications_description')}</p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' checked={profile.marketingCommunications} onChange={handleToggleMarketingCommunications} className='sr-only peer' />
                  <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for NFT Selection */}
      {isAvatarModalOpen && (
        <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'>
          <div ref={avatarModalRef} className='bg-dark-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto' onClick={e => e.stopPropagation()}>
            <div className='sticky top-0 bg-dark-800 p-4 border-b border-dark-700 flex justify-between items-center'>
              <h2 className='text-xl font-semibold text-primary-300'>{t('select_nft_avatar_title')}</h2>
              <button onClick={() => setIsAvatarModalOpen(false)} className='p-1 rounded-full hover:bg-dark-700 transition-colors'>
                <svg className='w-6 h-6 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            <div className='p-4'>
              <NftSelector blockchainId={blockchainId || ''} onSelect={handleSelectNft} currentAvatarId={profile.avatarNftId || undefined} />
            </div>

            <div className='sticky bottom-0 bg-dark-800 p-4 border-t border-dark-700 flex justify-end space-x-3'>
              <button onClick={() => setIsAvatarModalOpen(false)} className='px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                {t('cancel')}
              </button>
              <button onClick={handleSaveAvatar} disabled={!selectedNft || isUpdatingAvatar} className={`px-4 py-2 bg-primary-500 text-white rounded-lg transition-colors ${!selectedNft || isUpdatingAvatar ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'}`}>
                {isUpdatingAvatar ? t('saving') : t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ajouter les styles d'animation */}
      <style>
        {`
          @keyframes light-sweep {
            0% {
              background: conic-gradient(
                from 0deg at 50% 50%,
                rgba(139, 92, 246, 0.1) 0%,
                rgba(168, 85, 247, 0.9) 20%,
                rgba(139, 92, 246, 0.1) 40%,
                rgba(139, 92, 246, 0.1) 60%,
                rgba(168, 85, 247, 0.9) 80%,
                rgba(139, 92, 246, 0.1) 100%
              );
              transform: rotate(0deg);
            }
            100% {
              background: conic-gradient(
                from 0deg at 50% 50%,
                rgba(139, 92, 246, 0.1) 0%,
                rgba(168, 85, 247, 0.9) 20%,
                rgba(139, 92, 246, 0.1) 40%,
                rgba(139, 92, 246, 0.1) 60%,
                rgba(168, 85, 247, 0.9) 80%,
                rgba(139, 92, 246, 0.1) 100%
              );
              transform: rotate(360deg);
            }
          }
          
          .animate-light-sweep {
            animation: light-sweep 3s linear infinite;
          }
        `}
      </style>
    </div>
  )
}

export default ProfilePage
