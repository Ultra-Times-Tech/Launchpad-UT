import {useState, useEffect} from 'react'
import useAlerts from '../../hooks/useAlert'
import {useUltraWallet} from '../../utils/ultraWalletHelper'
import { apiRequestor } from '../../utils/axiosInstanceHelper'
import { getUserAvatar, setUserAvatar, Nft, fetchUserNfts } from '../../utils/nftService'
import NftSelector from '../../components/NftSelector'

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
  const [avatarImage, setAvatarImage] = useState<string | null>(null)
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false)
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    email: 'user@example.com',
    username: null,
    emailNotifications: false,
    marketingCommunications: false,
    avatarNftId: null
  })
  const [newEmail, setNewEmail] = useState(profile.email)
  const [newUsername, setNewUsername] = useState(profile.username || '')

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

    const fetchAvatar = async () => {
      try {
        if (!blockchainId) {
          console.log('Impossible de récupérer l\'avatar : blockchainId est null');
          return;
        }
        
        console.log('Récupération de l\'avatar pour :', blockchainId);
        const avatarData = await getUserAvatar(blockchainId);
        console.log('Données de l\'avatar récupérées :', avatarData);
        
        const avatarNftId = avatarData?.nft_id || null;
        
        setProfile(prev => ({
          ...prev,
          avatarNftId,
        }));

        // Si un avatar existe, récupérer les détails du NFT correspondant
        if (avatarNftId) {
          setIsLoadingAvatar(true);
          try {
            console.log('Récupération des détails du NFT pour l\'avatar avec ID :', avatarNftId);
            const userNfts = await fetchUserNfts(blockchainId);
            console.log('NFTs récupérés :', userNfts);
            
            const avatarNft = userNfts.find(nft => nft.id === avatarNftId);
            console.log('NFT correspondant à l\'avatar :', avatarNft);
            
            if (avatarNft) {
              setSelectedNft(avatarNft);
              const imageUrl = avatarNft.metadata.content.medias.square?.uri || 
                         avatarNft.metadata.content.medias.product?.uri || 
                         avatarNft.metadata.content.medias.gallery?.uri ||
                         avatarNft.metadata.content.medias.hero?.uri;
              
              console.log('URL de l\'image de l\'avatar :', imageUrl);
              setAvatarImage(imageUrl || null);
            } else {
              console.warn('Aucun NFT correspondant trouvé pour l\'avatar avec ID :', avatarNftId);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération des détails du NFT avatar:', error);
          } finally {
            setIsLoadingAvatar(false);
          }
        } else {
          console.log('Aucun avatar défini pour cet utilisateur');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'avatar:', error);
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
      fetchAvatar();
    } else {
      console.log('Attente du blockchainId avant de récupérer les données de profil');
    }
  }, [blockchainId]);

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      email: newEmail,
    }))
    setIsEditing(false)
    success('Email mis à jour avec succès !')
  }

  const handleSaveUsername = async () => {
    if (!blockchainId || !newUsername.trim()) {
      showError('Blockchain ID ou nom d\'utilisateur manquant.')
      return
    }

    const txObject = {
      action: 'updatename',
      contract: 'ultra.avatar',
      data: {
        account: blockchainId,
        username: newUsername.trim(),
      },
    }

    try {
      const response = await signTransaction(txObject)

      if (response && response.data?.transactionHash) {
        const finalUsername = newUsername.trim()
        setProfile(prev => ({
          ...prev,
          username: finalUsername || null,
        }))
        setNewUsername(finalUsername)
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
        // Récupérer l'URL de l'image du NFT sélectionné
        const imageUrl = selectedNft.metadata.content.medias.square?.uri || 
                      selectedNft.metadata.content.medias.product?.uri || 
                      selectedNft.metadata.content.medias.gallery?.uri ||
                      selectedNft.metadata.content.medias.hero?.uri;
        
        setAvatarImage(imageUrl || null);
        
        // Mettre à jour le profil avec le nouvel avatar
        setProfile(prev => ({
          ...prev,
          avatarNftId: selectedNft.id,
        }))
        
        // Notifier le backend de la mise à jour
        await setUserAvatar(blockchainId, selectedNft.id);
        
        setIsAvatarModalOpen(false);
        success('Avatar mis à jour avec succès !');
      } else {
        showError(walletError || 'Échec de la signature ou de la diffusion de la transaction.')
        console.error('Transaction failed or was declined:', response, walletError)
      }
    } catch (err) {
      console.error('Error during avatar update process:', err)
      showError('Une erreur inattendue s\'est produite lors de la mise à jour de l\'avatar.')
    } finally {
      setIsUpdatingAvatar(false);
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
                <button 
                  onClick={() => setIsAvatarModalOpen(true)}
                  className='mt-2 px-3 py-1 bg-primary-600 text-sm text-white rounded-lg hover:bg-primary-700 transition-colors'
                >
                  Changer d'avatar
                </button>
              </div>
            </div>

            {/* Username */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-400 mb-2'>Nom d'utilisateur</label>
              {isEditingUsername ? (
                <div className='flex items-center space-x-2'>
                  <input type='text' value={newUsername} onChange={e => setNewUsername(e.target.value)} className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500' placeholder="Entrez votre nom d'utilisateur" />
                  <button onClick={handleSaveUsername} disabled={isWalletLoading} className={`px-4 py-2 bg-primary-500 text-white rounded-lg transition-colors ${isWalletLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'}`}>
                    {isWalletLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingUsername(false)
                      setNewUsername(profile.username || '')
                    }}
                    disabled={isWalletLoading}
                    className={`px-4 py-2 bg-dark-700 text-white rounded-lg transition-colors ${isWalletLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark-600'}`}>
                    Annuler
                  </button>
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
          <div className="bg-dark-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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