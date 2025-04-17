import {useState, useEffect, useRef} from 'react'
import useAlerts from '../../hooks/useAlert'
import {useUltraWallet} from '../../utils/ultraWalletHelper'
import { apiRequestor } from '../../utils/axiosInstanceHelper'
import { getUserAvatar, fetchUserNfts, Nft } from '../../utils/nftService'
import NftSelector from '../../components/NftSelector'
import useUserAvatar, { refreshUserAvatar, clearAvatarCache } from '../../hooks/useUserAvatar'

interface ProfileData {
  email: string
  username: string | null
  emailNotifications: boolean
  marketingCommunications: boolean
  avatarNftId: string | null
}

function ProfilePage() {
  const {blockchainId, signTransaction, isLoading: isWalletLoading, error: walletError} = useUltraWallet()
  const {success, error: showError} = useAlerts()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [selectedNft, setSelectedNft] = useState<Nft | null>(null)
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false)
  const { imageUrl: avatarImage, isLoading: isLoadingAvatar, avatarNftId, updateLocalAvatar, refreshAvatar } = useUserAvatar(blockchainId)
  const avatarModalRef = useRef<HTMLDivElement>(null)
  const [profile, setProfile] = useState<ProfileData>({
    email: 'user@example.com',
    username: null,
    emailNotifications: false,
    marketingCommunications: false,
    avatarNftId: null
  })
  const [newEmail, setNewEmail] = useState(profile.email)
  const [newUsername, setNewUsername] = useState(profile.username || '')
  const [usernameValid, setUsernameValid] = useState(true)

  // Gérer la fermeture de la popup en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isAvatarModalOpen && avatarModalRef.current && !avatarModalRef.current.contains(event.target as Node)) {
        setIsAvatarModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAvatarModalOpen]);

  // Forcer le rechargement de l'avatar au chargement de la page
  useEffect(() => {
    if (blockchainId) {
      // Vider le cache pour forcer un rechargement frais
      clearAvatarCache(blockchainId);
      refreshAvatar();
      console.log('[ProfilePage] Avatar forcé à recharger pour:', blockchainId);
    }
  }, [blockchainId]);

  // Mettre à jour avatarNftId dans le profil quand il change dans le hook
  useEffect(() => {
    if (avatarNftId !== profile.avatarNftId) {
      setProfile(prev => ({
        ...prev,
        avatarNftId
      }));
    }
  }, [avatarNftId, profile.avatarNftId]);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (!blockchainId) {
          console.log('Impossible de récupérer le nom d\'utilisateur : blockchainId est null');
          return;
        }
        
        console.log('Récupération du nom d\'utilisateur pour :', blockchainId);
        const response = await apiRequestor.get(`/users/${blockchainId}/username`);
        console.log('Réponse du nom d\'utilisateur :', response.data);
        
        const fetchedUsername = response.data.username || null;
        setNewUsername(fetchedUsername || '');
        setProfile(prev => ({
          ...prev,
          username: fetchedUsername,
        }));
      } catch (error) {
        console.error('Erreur lors de la récupération du nom d\'utilisateur:', error);
        if ((error as any).response) {
          console.error('Statut de la réponse:', (error as any).response.status);
          console.error('Données de la réponse:', (error as any).response.data);
        }
      }
    };

    // Attendre que le blockchainId soit défini avant de faire les appels API
    if (blockchainId) {
      console.log('BlockchainId disponible, démarrage des récupérations de données');
      fetchUsername();
    } else {
      console.log('Attente du blockchainId avant de récupérer les données de profil');
    }
  }, [blockchainId]);

  // Vérifier la validité du nom d'utilisateur
  useEffect(() => {
    setUsernameValid(newUsername.trim().length >= 3 || newUsername.trim().length === 0);
  }, [newUsername]);

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      email: newEmail,
    }))
    setIsEditing(false)
    success('Email mis à jour avec succès !')
  }

  const handleSaveUsername = async () => {
    if (!blockchainId) {
      showError('Blockchain ID manquant.')
      return
    }
    
    const trimmedUsername = newUsername.trim();
    
    if (trimmedUsername.length < 3) {
      showError('Le nom d\'utilisateur doit contenir au moins 3 caractères.')
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
        success('Nom d\'utilisateur mis à jour avec succès !')
      } else {
        showError(walletError || 'Échec de la signature ou de la diffusion de la transaction.')
        console.error('Transaction failed or was declined:', response, walletError)
      }
    } catch (err) {
      console.error('Error during signTransaction process:', err)
      showError('Une erreur inattendue s\'est produite lors de la mise à jour du nom d\'utilisateur.')
    }
  }

  const handleSaveAvatar = async () => {
    if (!blockchainId || !selectedNft) {
      showError('Blockchain ID ou NFT manquant.')
      return
    }

    setIsUpdatingAvatar(true);

    try {
      // Extraire l'URL de l'image du NFT sélectionné 
      const imageUrl = selectedNft.metadata.content.medias.square?.uri || 
                      selectedNft.metadata.content.medias.product?.uri || 
                      selectedNft.metadata.content.medias.gallery?.uri ||
                      selectedNft.metadata.content.medias.hero?.uri;
      
      // Mettre à jour l'avatar localement AVANT la transaction blockchain
      // pour une mise à jour visuelle immédiate
      updateLocalAvatar(selectedNft.id, imageUrl);

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
        // La mise à jour visuelle est déjà faite, mais on déclenche aussi 
        // la mise à jour "officielle" depuis le serveur en arrière-plan
        if (blockchainId) {
          refreshUserAvatar(blockchainId);
        }
        
        setIsAvatarModalOpen(false);
        success('Avatar mis à jour avec succès !');
      } else {
        // En cas d'échec, on réinitialise l'avatar à sa valeur précédente
        if (blockchainId) {
          refreshUserAvatar(blockchainId);
        }
        showError(walletError || 'Échec de la signature ou de la diffusion de la transaction.')
        console.error('Transaction failed or was declined:', response, walletError)
      }
    } catch (err) {
      // En cas d'erreur, réinitialiser l'avatar depuis le serveur
      if (blockchainId) {
        refreshUserAvatar(blockchainId);
      }
      console.error('Error during avatar update process:', err)
      showError('Une erreur inattendue s\'est produite lors de la mise à jour de l\'avatar.')
    } finally {
      setIsUpdatingAvatar(false);
    }
  }

  const handleRemoveAvatar = async () => {
    if (!blockchainId) {
      showError('Blockchain ID manquant.')
      return
    }

    setIsRemovingAvatar(true);

    try {
      // Mise à jour visuelle immédiate avant la transaction
      updateLocalAvatar(null);

      const txObject = {
        action: 'clearavatar',
        contract: 'ultra.avatar',
        data: {
          user: blockchainId,
        },
      }

      const response = await signTransaction(txObject)

      if (response && response.data?.transactionHash) {
        // Mettre à jour en arrière-plan depuis le serveur
        if (blockchainId) {
          refreshUserAvatar(blockchainId);
        }
        
        success('Avatar supprimé avec succès !');
      } else {
        // En cas d'échec, réinitialiser l'avatar
        if (blockchainId) {
          refreshUserAvatar(blockchainId);
        }
        showError(walletError || 'Échec de la signature ou de la diffusion de la transaction.')
        console.error('Transaction failed or was declined:', response, walletError)
      }
    } catch (err) {
      // En cas d'erreur, réinitialiser l'avatar
      if (blockchainId) {
        refreshUserAvatar(blockchainId);
      }
      console.error('Error during avatar removal process:', err)
      showError('Une erreur inattendue s\'est produite lors de la suppression de l\'avatar.')
    } finally {
      setIsRemovingAvatar(false);
    }
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(blockchainId || '')
      success('Adresse du portefeuille copiée dans le presse-papiers !')
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const handleToggleEmailNotifications = () => {
    setProfile(prev => {
      const newValue = !prev.emailNotifications
      success(`Notifications par e-mail ${newValue ? 'activées' : 'désactivées'} !`)
      return {
        ...prev,
        emailNotifications: newValue,
      }
    })
  }

  const handleToggleMarketingCommunications = () => {
    setProfile(prev => {
      const newValue = !prev.marketingCommunications
      success(`Communications marketing ${newValue ? 'activées' : 'désactivées'} !`)
      return {
        ...prev,
        marketingCommunications: newValue,
      }
    })
  }

  const handleSelectNft = (nft: Nft) => {
    setSelectedNft(nft);
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-3xl font-bold text-primary-300 mb-8'>Paramètres du profil</h1>

          <div className='bg-dark-800 rounded-xl p-6 shadow-lg'>
            {/* Profile Avatar */}
            <div className='flex items-center space-x-4 mb-8'>
              <div className='w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-primary-500 border-2 border-primary-400/30'>
                {isLoadingAvatar ? (
                  <div className="animate-pulse w-full h-full bg-primary-600"></div>
                ) : profile.avatarNftId && avatarImage ? (
                  <img 
                    src={avatarImage} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className='w-10 h-10 text-white' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                  </svg>
                )}
              </div>
              <div>
                <h2 className='text-xl font-semibold'>Votre profil</h2>
                <p className='text-gray-400 text-sm'>Gérer les paramètres de votre compte</p>
                <div className="mt-2 space-x-2">
                  <button 
                    onClick={() => setIsAvatarModalOpen(true)}
                    className='px-3 py-1 bg-primary-600 text-sm text-white rounded-lg hover:bg-primary-700 transition-colors'
                  >
                    Changer d'avatar
                  </button>
                  {profile.avatarNftId && (
                    <button 
                      onClick={handleRemoveAvatar}
                      disabled={isRemovingAvatar}
                      className={`px-3 py-1 bg-red-600 text-sm text-white rounded-lg transition-colors ${isRemovingAvatar ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
                    >
                      {isRemovingAvatar ? 'Suppression...' : 'Supprimer l\'avatar'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Username */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-400 mb-2'>Nom d'utilisateur</label>
              {isEditingUsername ? (
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <div className="relative w-full">
                      <input 
                        type='text' 
                        value={newUsername} 
                        onChange={e => setNewUsername(e.target.value)} 
                        className={`w-full px-4 py-2 bg-dark-900 border rounded-lg text-white focus:outline-none focus:border-primary-500 ${!usernameValid ? 'border-red-500' : 'border-dark-700'}`} 
                        placeholder="Entrez votre nom d'utilisateur (min. 3 caractères)" 
                      />
                      {!usernameValid && newUsername.trim().length > 0 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={handleSaveUsername} 
                      disabled={isWalletLoading || !usernameValid || newUsername.trim().length < 3} 
                      className={`px-4 py-2 bg-primary-500 text-white rounded-lg transition-colors ${(isWalletLoading || !usernameValid || newUsername.trim().length < 3) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'}`}
                    >
                      {isWalletLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false)
                        setNewUsername(profile.username || '')
                      }}
                      disabled={isWalletLoading}
                      className={`px-4 py-2 bg-dark-700 text-white rounded-lg transition-colors ${isWalletLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark-600'}`}
                    >
                      Annuler
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">Le nom d'utilisateur doit contenir au moins 3 caractères.</p>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <input type='text' value={profile.username || ''} disabled placeholder="Aucun nom d'utilisateur défini" className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-300 focus:outline-none' />
                  <button onClick={() => setIsEditingUsername(true)} className='px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                    Modifier
                  </button>
                </div>
              )}
            </div>

            {/* Wallet Address */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-400 mb-2'>Adresse du portefeuille</label>
              <div className='flex items-center space-x-2'>
                <div className='flex-1 px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-300'>{blockchainId}</div>
                <button onClick={handleCopyAddress} className='px-3 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                  Copier
                </button>
              </div>
            </div>

            {/* Email */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-400 mb-2'>Adresse e-mail</label>
              {isEditing ? (
                <div className='flex items-center space-x-2'>
                  <input type='email' value={newEmail} onChange={e => setNewEmail(e.target.value)} className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500' placeholder='Entrez votre e-mail' />
                  <button onClick={handleSave} className='px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors'>
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setNewEmail(profile.email)
                    }}
                    className='px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                    Annuler
                  </button>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <input type='email' value={profile.email} disabled className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-300 focus:outline-none' />
                  <button onClick={() => setIsEditing(true)} className='px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                    Modifier
                  </button>
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-primary-300'>Préférences</h3>
              <div className='flex items-center justify-between py-3 border-b border-dark-700'>
                <div>
                  <h4 className='font-medium'>Notifications par e-mail</h4>
                  <p className='text-sm text-gray-400'>Recevoir des mises à jour par e-mail concernant votre activité</p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' checked={profile.emailNotifications} onChange={handleToggleEmailNotifications} className='sr-only peer' />
                  <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              <div className='flex items-center justify-between py-3 border-b border-dark-700'>
                <div>
                  <h4 className='font-medium'>Communications marketing</h4>
                  <p className='text-sm text-gray-400'>Recevoir des mises à jour concernant les nouvelles collections</p>
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div 
            ref={avatarModalRef}
            className="bg-dark-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-dark-800 p-4 border-b border-dark-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary-300">Choisir un NFT pour votre avatar</h2>
              <button 
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1 rounded-full hover:bg-dark-700 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <NftSelector 
                blockchainId={blockchainId || ''} 
                onSelect={handleSelectNft}
                currentAvatarId={profile.avatarNftId || undefined}
              />
            </div>

            <div className="sticky bottom-0 bg-dark-800 p-4 border-t border-dark-700 flex justify-end space-x-3">
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveAvatar}
                disabled={!selectedNft || isUpdatingAvatar}
                className={`px-4 py-2 bg-primary-500 text-white rounded-lg transition-colors ${(!selectedNft || isUpdatingAvatar) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'}`}
              >
                {isUpdatingAvatar ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage