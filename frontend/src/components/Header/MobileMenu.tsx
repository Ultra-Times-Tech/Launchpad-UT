import {Link} from 'react-router-dom'
import {MobileMenuProps} from '../../types/header.types'
import SocialLinks from './SocialLinks'
import useUserAvatar from '../../hooks/useUserAvatar'
import {useUsername} from '../../hooks/useUsername'

const MobileMenu = ({isOpen, blockchainId, t, closeMenu, handleConnect, handleDisconnect}: MobileMenuProps) => {
  const {imageUrl, isLoading} = useUserAvatar(blockchainId)
  const {username, isLoading: usernameLoading} = useUsername(blockchainId)

  return (
    <>
      {isOpen && <div className='fixed inset-0 bg-dark-950 bg-opacity-50 z-40 lg:hidden' onClick={closeMenu} />}

      <div className={`fixed top-16 left-0 right-0 bg-dark-900 border-b border-dark-700 transition-all duration-300 ease-in-out lg:hidden z-40 ${isOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-[-100%] opacity-0 invisible'}`}>
        <div className='px-4 sm:px-6 py-4'>
          <nav className='flex flex-col space-y-4'>
            {(['home', 'collections', 'contact'] as const).map(item => (
              <Link key={item} to={`/${item === 'home' ? '' : item}`} onClick={closeMenu} className='text-white hover:text-primary-300 transition-colors py-2'>
                {t(item)}
              </Link>
            ))}

            {blockchainId && (
              <div className='border-t border-dark-700 pt-4'>
                <div className='px-2 py-3 flex items-center space-x-3'>
                  <div className='w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-primary-500 border-2 border-primary-400/30'>
                    {isLoading ? (
                      <div className='animate-pulse w-full h-full bg-primary-600'></div>
                    ) : imageUrl ? (
                      <img src={imageUrl} alt='Avatar' className='w-full h-full object-cover' />
                    ) : (
                      <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className='text-sm text-gray-400'>{usernameLoading ? t('loading') : username ? username : t('connected_wallet' as const)}</p>
                    <p className='text-sm font-medium text-primary-300 break-all'>{blockchainId}</p>
                  </div>
                </div>
                <Link to='/profile' onClick={closeMenu} className='block py-2 text-white hover:text-primary-300 transition-colors'>
                  {t('profile_settings' as const)}
                </Link>
                <Link to='/my-collections' onClick={closeMenu} className='block py-2 text-white hover:text-primary-300 transition-colors'>
                  {t('my_collections' as const)}
                </Link>
                <Link to='/my-uniqs' onClick={closeMenu} className='block py-2 text-white hover:text-primary-300 transition-colors'>
                  {t('my_uniqs' as const)}
                </Link>
                <button onClick={handleDisconnect} className='w-full text-left py-2 text-red-400 hover:text-red-500 transition-colors'>
                  {t('disconnect' as const)}
                </button>
              </div>
            )}

            <SocialLinks />

            {!blockchainId && (
              <div className='py-2'>
                <button onClick={handleConnect} className='w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200'>
                  {t('connect_wallet' as const)}
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}

export default MobileMenu
