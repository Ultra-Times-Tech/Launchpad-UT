import {Link} from 'react-router-dom'
import {ProfileDropdownProps} from '../../types/header.types'
import useUserAvatar from '../../hooks/useUserAvatar'
import {useUsername} from '../../hooks/useUsername'

const ProfileDropdown = ({isOpen, blockchainId, t, handleDisconnect, setIsOpen, profileDropdownRef}: ProfileDropdownProps) => {
  const {imageUrl, isLoading} = useUserAvatar(blockchainId)
  const {username, isLoading: usernameLoading} = useUsername(blockchainId)

  return (
    <div className='relative' ref={profileDropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className='flex items-center space-x-2 bg-dark-800 hover:bg-dark-700 rounded-lg px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20'>
        <div className='w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-primary-500 border-2 border-primary-400/30'>
          {isLoading ? (
            <div className='animate-pulse w-full h-full bg-primary-600'></div>
          ) : imageUrl ? (
            <img src={imageUrl} alt='Avatar' className='w-full h-full object-cover' />
          ) : (
            <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
            </svg>
          )}
        </div>
        <span className='hidden sm:inline'>{usernameLoading ? <div className='animate-pulse w-20 h-4 bg-dark-700 rounded'></div> : username ? username : `${blockchainId.slice(0, 6)}...${blockchainId.slice(-4)}`}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-64 bg-dark-800 rounded-xl shadow-lg py-2 border border-dark-700 z-50'>
          <div className='px-4 py-3 border-b border-dark-700'>
            <p className='text-sm text-gray-400'>{t('connected_wallet' as const)}</p>
            <p className='text-sm font-medium text-primary-300 break-all'>{blockchainId}</p>
          </div>
          <Link to='/profile' className='block px-4 py-2 text-sm text-white hover:bg-dark-700 transition-colors' onClick={() => setIsOpen(false)}>
            {t('profile_settings' as const)}
          </Link>
          <Link to='/my-collections' className='block px-4 py-2 text-sm text-white hover:bg-dark-700 transition-colors' onClick={() => setIsOpen(false)}>
            {t('my_collections' as const)}
          </Link>
          <Link to='/my-uniqs' className='block px-4 py-2 text-sm text-white hover:bg-dark-700 transition-colors' onClick={() => setIsOpen(false)}>
            {t('my_uniqs' as const)}
          </Link>
          <button onClick={handleDisconnect} className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 transition-colors'>
            {t('disconnect' as const)}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
