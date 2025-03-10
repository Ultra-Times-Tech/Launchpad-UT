import {Link} from 'react-router-dom'
import {useState, useEffect, useRef} from 'react'
import {getAssetUrl} from '../utils/imageHelper'
import WalletConnectButton from './Button/WalletConnectButton'

function Header() {
  const [blockchainId, setBlockchainId] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleWalletConnect = (id: string) => {
    setBlockchainId(id)
    console.log('Connected to Ultra wallet with blockchain ID:', id)
  }

  const handleWalletDisconnect = () => {
    setBlockchainId(null)
    setIsProfileOpen(false)
    console.log('Disconnected from Ultra wallet')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  return (
    <header className='relative border-b border-dark-700 bg-dark-900 text-white w-full'>
      <div className='w-full px-4 sm:px-6 lg:px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo - Left */}
          <div className='flex-shrink-0'>
            <Link to='/' className='flex items-center space-x-2'>
              <img src={getAssetUrl('/logos/logo-ut.png')} alt='Ultra Times Logo' className='h-8 w-auto' />
              <span className='text-lg sm:text-xl font-semibold text-primary-300 whitespace-nowrap'>
                <span className='hidden sm:inline'>Launchpad | </span>
                <span>Ultra Times</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className='hidden lg:flex items-center justify-center flex-1 px-8 font-quicksand'>
            <div className='flex space-x-8'>
              <Link to='/' className='text-white hover:text-primary-300 transition-colors px-2'>
                Home
              </Link>
              <Link to='/collections' className='text-white hover:text-primary-300 transition-colors px-2'>
                Collections
              </Link>
              <Link to='/authors' className='text-white hover:text-primary-300 transition-colors px-2'>
                Authors
              </Link>
              <Link to='/shop' className='text-white hover:text-primary-300 transition-colors px-2'>
                Shop
              </Link>
              <Link to='/contact' className='text-white hover:text-primary-300 transition-colors px-2'>
                Contact
              </Link>
            </div>
          </nav>

          {/* Social & Wallet - Right */}
          <div className='hidden lg:flex items-center space-x-6'>
            <div className='flex items-center space-x-2'>
              <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-primary-300 transition-colors p-2'>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                </svg>
              </a>
              <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-primary-300 transition-colors p-2'>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
              </a>
              <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-primary-300 transition-colors p-2'>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' />
                </svg>
              </a>
            </div>

            {blockchainId ? (
              <div className='relative' ref={profileDropdownRef}>
                <button onClick={toggleProfile} className='flex items-center space-x-2 bg-dark-800 hover:bg-dark-700 rounded-lg px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20'>
                  <div className='w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center'>
                    <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                    </svg>
                  </div>
                  <span className='hidden sm:inline'>My Profile</span>
                  <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className='absolute right-0 mt-2 w-64 bg-dark-800 rounded-xl shadow-lg py-2 border border-dark-700 z-50'>
                    <div className='px-4 py-3 border-b border-dark-700'>
                      <p className='text-sm text-gray-400'>Connected Wallet</p>
                      <p className='text-sm font-medium text-primary-300 break-all'>{blockchainId}</p>
                    </div>
                    <Link to='/profile' className='block px-4 py-2 text-sm text-white hover:bg-dark-700 transition-colors' onClick={() => setIsProfileOpen(false)}>
                      Profile Settings
                    </Link>
                    <Link to='/my-collections' className='block px-4 py-2 text-sm text-white hover:bg-dark-700 transition-colors' onClick={() => setIsProfileOpen(false)}>
                      My Collections
                    </Link>
                    <Link to='/transactions' className='block px-4 py-2 text-sm text-white hover:bg-dark-700 transition-colors' onClick={() => setIsProfileOpen(false)}>
                      Transaction History
                    </Link>
                    <button onClick={handleWalletDisconnect} className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 transition-colors'>
                      Disconnect Wallet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <WalletConnectButton onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} className='z-10' />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className='lg:hidden p-2 rounded-lg hover:bg-dark-800 transition-colors z-50' aria-label='Toggle menu'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
              {isMenuOpen ? <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /> : <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className='fixed inset-0 bg-dark-950 bg-opacity-50 z-40 lg:hidden' onClick={closeMenu} />}

      {/* Mobile Menu Panel */}
      <div className={`fixed top-16 left-0 right-0 bg-dark-900 border-b border-dark-700 transition-all duration-300 ease-in-out lg:hidden z-40 ${isMenuOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-[-100%] opacity-0 invisible'}`}>
        <div className='px-4 sm:px-6 py-4'>
          <nav className='flex flex-col space-y-4'>
            <Link to='/' onClick={closeMenu} className='text-white hover:text-primary-300 transition-colors py-2'>
              Home
            </Link>
            <Link to='/collections' onClick={closeMenu} className='text-white hover:text-primary-300 transition-colors py-2'>
              Collections
            </Link>
            <Link to='/authors' onClick={closeMenu} className='text-white hover:text-primary-300 transition-colors py-2'>
              Authors
            </Link>
            <Link to='/shop' onClick={closeMenu} className='text-white hover:text-primary-300 transition-colors py-2'>
              Shop
            </Link>
            <Link to='/contact' onClick={closeMenu} className='text-white hover:text-primary-300 transition-colors py-2'>
              Contact
            </Link>

            {blockchainId && (
              <>
                <div className='border-t border-dark-700 pt-4'>
                  <div className='px-2 py-3'>
                    <p className='text-sm text-gray-400'>Connected Wallet</p>
                    <p className='text-sm font-medium text-primary-300 break-all'>{blockchainId}</p>
                  </div>
                  <Link to='/profile' onClick={closeMenu} className='block py-2 text-white hover:text-primary-300 transition-colors'>
                    Profile Settings
                  </Link>
                  <Link to='/my-collections' onClick={closeMenu} className='block py-2 text-white hover:text-primary-300 transition-colors'>
                    My Collections
                  </Link>
                  <Link to='/transactions' onClick={closeMenu} className='block py-2 text-white hover:text-primary-300 transition-colors'>
                    Transaction History
                  </Link>
                  <button onClick={handleWalletDisconnect} className='w-full text-left py-2 text-red-400 hover:text-red-500 transition-colors'>
                    Disconnect Wallet
                  </button>
                </div>
              </>
            )}

            <div className='flex items-center space-x-4 py-2'>
              <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-primary-300 transition-colors p-2'>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                </svg>
              </a>
              <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-primary-300 transition-colors p-2'>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
              </a>
              <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-primary-300 transition-colors p-2'>
                <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' />
                </svg>
              </a>
            </div>

            {!blockchainId && (
              <div className='py-2'>
                <WalletConnectButton onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} className='z-10 w-full' />
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
