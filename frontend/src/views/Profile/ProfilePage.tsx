import {useState, useEffect} from 'react'
import useAlerts from '../../hooks/useAlert'
import {useUltraWallet} from '../../utils/ultraWalletHelper'
import { apiRequestor } from '../../utils/axiosInstanceHelper'

interface ProfileData {
  email: string
  username: string | null
  emailNotifications: boolean
  marketingCommunications: boolean
}

function ProfilePage() {
  const {blockchainId, signTransaction, isLoading: isWalletLoading, error: walletError} = useUltraWallet()
  const {success, error: showError} = useAlerts()
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    email: 'user@example.com',
    username: null,
    emailNotifications: false,
    marketingCommunications: false,
  })
  const [newEmail, setNewEmail] = useState(profile.email)
  const [newUsername, setNewUsername] = useState(profile.username || '')

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await apiRequestor.get(`/users/${blockchainId}/username`)
        const fetchedUsername = response.data.username || null
        setNewUsername(fetchedUsername || '')
        setProfile(prev => ({
          ...prev,
          username: fetchedUsername,
        }))
      } catch (error) {
        console.error('Error fetching username:', error)
      }
    }

    fetchUsername()
  }, [blockchainId])

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      email: newEmail,
    }))
    setIsEditing(false)
    success('Email updated successfully!')
  }

  const handleSaveUsername = async () => {
    if (!blockchainId || !newUsername.trim()) {
      showError('Blockchain ID or username is missing.')
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
        success(`Username updated successfully!`)
      } else {
        showError(walletError || 'Failed to sign or broadcast transaction.')
        console.error('Transaction failed or was declined:', response, walletError)
      }
    } catch (err) {
      console.error('Error during signTransaction process:', err)
      showError('An unexpected error occurred while updating username.')
    }
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(blockchainId || '')
      success('Wallet address copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const handleToggleEmailNotifications = () => {
    setProfile(prev => {
      const newValue = !prev.emailNotifications
      success(`Email notifications ${newValue ? 'enabled' : 'disabled'}!`)
      return {
        ...prev,
        emailNotifications: newValue,
      }
    })
  }

  const handleToggleMarketingCommunications = () => {
    setProfile(prev => {
      const newValue = !prev.marketingCommunications
      success(`Marketing communications ${newValue ? 'enabled' : 'disabled'}!`)
      return {
        ...prev,
        marketingCommunications: newValue,
      }
    })
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-3xl font-bold text-primary-300 mb-8'>Profile Settings</h1>

          <div className='bg-dark-800 rounded-xl p-6 shadow-lg'>
            {/* Profile Avatar */}
            <div className='flex items-center space-x-4 mb-8'>
              <div className='w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center'>
                <svg className='w-10 h-10 text-white' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                </svg>
              </div>
              <div>
                <h2 className='text-xl font-semibold'>Your Profile</h2>
                <p className='text-gray-400 text-sm'>Manage your account settings</p>
              </div>
            </div>

            {/* Username */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-400 mb-2'>Username</label>
              {isEditingUsername ? (
                <div className='flex items-center space-x-2'>
                  <input type='text' value={newUsername} onChange={e => setNewUsername(e.target.value)} className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500' placeholder='Enter your username' />
                  <button onClick={handleSaveUsername} disabled={isWalletLoading} className={`px-4 py-2 bg-primary-500 text-white rounded-lg transition-colors ${isWalletLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-600'}`}>
                    {isWalletLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingUsername(false)
                      setNewUsername(profile.username || '')
                    }}
                    disabled={isWalletLoading}
                    className={`px-4 py-2 bg-dark-700 text-white rounded-lg transition-colors ${isWalletLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark-600'}`}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <input type='text' value={profile.username || ''} disabled placeholder='No username set' className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-300 focus:outline-none' />
                  <button onClick={() => setIsEditingUsername(true)} className='px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Wallet Address */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-400 mb-2'>Wallet Address</label>
              <div className='flex items-center space-x-2'>
                <div className='flex-1 px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-300'>{blockchainId}</div>
                <button onClick={handleCopyAddress} className='px-3 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                  Copy
                </button>
              </div>
            </div>

            {/* Email */}
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-400 mb-2'>Email Address</label>
              {isEditing ? (
                <div className='flex items-center space-x-2'>
                  <input type='email' value={newEmail} onChange={e => setNewEmail(e.target.value)} className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500' placeholder='Enter your email' />
                  <button onClick={handleSave} className='px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors'>
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setNewEmail(profile.email)
                    }}
                    className='px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <input type='email' value={profile.email} disabled className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-gray-300 focus:outline-none' />
                  <button onClick={() => setIsEditing(true)} className='px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors'>
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-primary-300'>Preferences</h3>
              <div className='flex items-center justify-between py-3 border-b border-dark-700'>
                <div>
                  <h4 className='font-medium'>Email Notifications</h4>
                  <p className='text-sm text-gray-400'>Receive email updates about your activity</p>
                </div>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' checked={profile.emailNotifications} onChange={handleToggleEmailNotifications} className='sr-only peer' />
                  <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              <div className='flex items-center justify-between py-3 border-b border-dark-700'>
                <div>
                  <h4 className='font-medium'>Marketing Communications</h4>
                  <p className='text-sm text-gray-400'>Receive updates about new collections</p>
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
    </div>
  )
}

export default ProfilePage