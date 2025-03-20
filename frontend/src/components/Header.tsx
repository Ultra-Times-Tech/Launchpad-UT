import {Link} from 'react-router-dom'
import {useState, useEffect, useRef} from 'react'
import {getAssetUrl} from '../utils/imageHelper'
import {useUltraWallet} from '../utils/ultraWalletHelper'
import useAlerts from '../hooks/useAlert'
import {useTranslation} from '../hooks/useTranslation'
import {TranslationKey} from '../types/translations'

// Types
interface SocialLinkProps {
  href: string
  icon: JSX.Element
}

interface LanguageButtonProps {
  lang: 'en' | 'fr' | 'de'
  isActive: boolean
  onClick: (lang: 'en' | 'fr' | 'de') => void
}

// Type pour la fonction de traduction
type TranslationFunction = (key: TranslationKey) => string

// Composants
const Logo = () => (
  <Link to='/' className='flex items-center space-x-2'>
    <img src={getAssetUrl('/logos/logo-ut.png')} alt='Ultra Times Logo' className='h-8 w-auto' />
    <span className='text-lg sm:text-xl font-semibold text-primary-300 whitespace-nowrap'>
      <span className='hidden sm:inline'>Launchpad | </span>
      <span>Ultra Times</span>
    </span>
  </Link>
)

const SocialLink = ({href, icon}: SocialLinkProps) => (
  <a href={href} target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-primary-300 transition-colors p-2'>
    {icon}
  </a>
)

const LanguageButton = ({lang, isActive, onClick}: LanguageButtonProps) => {
  const flags = {
    en: (
      <svg className='w-6 h-4' viewBox='0 0 36 24'>
        <rect width='36' height='24' fill='#012169' />
        <path d='M0,0 L36,24 M36,0 L0,24' stroke='#fff' strokeWidth='2.4' />
        <path d='M18,0 L18,24 M0,12 L36,12' stroke='#fff' strokeWidth='4' />
        <path d='M18,0 L18,24 M0,12 L36,12' stroke='#C8102E' strokeWidth='2.4' />
      </svg>
    ),
    fr: (
      <svg className='w-6 h-4' viewBox='0 0 36 24'>
        <rect width='36' height='24' fill='#ED2939' />
        <rect width='12' height='24' fill='#002395' />
        <rect x='12' width='12' height='24' fill='#fff' />
      </svg>
    ),
    de: (
      <svg className='w-6 h-4' viewBox='0 0 36 24'>
        <rect width='36' height='8' fill='#000' />
        <rect y='8' width='36' height='8' fill='#DD0000' />
        <rect y='16' width='36' height='8' fill='#FFCE00' />
      </svg>
    ),
  }

  return (
    <button className={`w-full p-2 hover:bg-dark-700 transition-colors flex items-center justify-center ${isActive ? 'bg-dark-700' : ''}`} role='menuitem' aria-label={lang.toUpperCase()} onClick={() => onClick(lang)}>
      {flags[lang]}
    </button>
  )
}

const DesktopNavigation = ({t, closeMenu}: {t: TranslationFunction; closeMenu: () => void}) => (
  <nav className='hidden lg:flex items-center justify-center flex-1 px-8 font-quicksand'>
    <div className='flex space-x-8'>
      {(['home', 'collections', 'authors', 'shop', 'contact'] as const).map(item => (
        <Link key={item} to={`/${item === 'home' ? '' : item}`} className='text-white hover:text-primary-300 transition-colors px-2' onClick={closeMenu}>
          {t(item)}
        </Link>
      ))}
    </div>
  </nav>
)

const SocialLinks = () => (
  <div className='flex items-center space-x-2'>
    <SocialLink
      href='https://twitter.com'
      icon={
        <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
        </svg>
      }
    />
    <SocialLink
      href='https://instagram.com'
      icon={
        <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
        </svg>
      }
    />
    <SocialLink
      href='https://facebook.com'
      icon={
        <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' />
        </svg>
      }
    />
  </div>
)

const LanguageSelector = ({isOpen, setIsOpen, currentLang, handleLanguageChange, getCurrentFlag, langMenuRef}: {isOpen: boolean; setIsOpen: (isOpen: boolean) => void; currentLang: string; handleLanguageChange: (lang: 'en' | 'fr' | 'de') => void; getCurrentFlag: () => JSX.Element; langMenuRef: React.RefObject<HTMLDivElement>}) => (
  <div className='relative' ref={langMenuRef}>
    <button
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen(!isOpen)
      }}
      className='flex items-center space-x-2 text-gray-400 hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded-lg p-2'
      aria-label='Select language'
      aria-expanded={isOpen}
      aria-controls='language-menu'
      type='button'>
      {getCurrentFlag()}
    </button>
    {isOpen && (
      <div id='language-menu' className='absolute mt-2 w-12 bg-dark-800 rounded-xl shadow-lg py-2 border border-dark-700 z-50' role='menu' aria-orientation='vertical' aria-labelledby='language-menu' style={{transform: 'translateX(50%)', right: '50%'}}>
        {['en', 'fr', 'de'].map(lang => (
          <LanguageButton key={lang} lang={lang as 'en' | 'fr' | 'de'} isActive={currentLang === lang} onClick={handleLanguageChange} />
        ))}
      </div>
    )}
  </div>
)

const ProfileDropdown = ({isOpen, blockchainId, t, handleDisconnect, setIsOpen, profileDropdownRef}: {isOpen: boolean; blockchainId: string; t: TranslationFunction; handleDisconnect: () => void; setIsOpen: (isOpen: boolean) => void; profileDropdownRef: React.RefObject<HTMLDivElement>}) => (
  <div className='relative' ref={profileDropdownRef}>
    <button onClick={() => setIsOpen(!isOpen)} className='flex items-center space-x-2 bg-dark-800 hover:bg-dark-700 rounded-lg px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20'>
      <div className='w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center'>
        <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
          <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
        </svg>
      </div>
      <span className='hidden sm:inline'>{`${blockchainId.slice(0, 6)}...${blockchainId.slice(-4)}`}</span>
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
        <button onClick={handleDisconnect} className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 transition-colors'>
          {t('disconnect' as const)}
        </button>
      </div>
    )}
  </div>
)

const MobileMenu = ({isOpen, blockchainId, t, closeMenu, handleConnect, handleDisconnect}: {isOpen: boolean; blockchainId: string | null; t: TranslationFunction; closeMenu: () => void; handleConnect: () => void; handleDisconnect: () => void}) => (
  <>
    {isOpen && <div className='fixed inset-0 bg-dark-950 bg-opacity-50 z-40 lg:hidden' onClick={closeMenu} />}

    <div className={`fixed top-16 left-0 right-0 bg-dark-900 border-b border-dark-700 transition-all duration-300 ease-in-out lg:hidden z-40 ${isOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-[-100%] opacity-0 invisible'}`}>
      <div className='px-4 sm:px-6 py-4'>
        <nav className='flex flex-col space-y-4'>
          {(['home', 'collections', 'authors', 'shop', 'contact'] as const).map(item => (
            <Link key={item} to={`/${item === 'home' ? '' : item}`} onClick={closeMenu} className='text-white hover:text-primary-300 transition-colors py-2'>
              {t(item)}
            </Link>
          ))}

          {blockchainId && (
            <div className='border-t border-dark-700 pt-4'>
              <div className='px-2 py-3'>
                <p className='text-sm text-gray-400'>{t('connected_wallet' as const)}</p>
                <p className='text-sm font-medium text-primary-300 break-all'>{blockchainId}</p>
              </div>
              <Link to='/profile' onClick={closeMenu} className='block py-2 text-white hover:text-primary-300 transition-colors'>
                {t('profile_settings' as const)}
              </Link>
              <Link to='/my-collections' onClick={closeMenu} className='block py-2 text-white hover:text-primary-300 transition-colors'>
                {t('my_collections' as const)}
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

// Composant principal
function Header() {
  const {blockchainId, connect, disconnect, error} = useUltraWallet()
  const {success, error: showError} = useAlerts()
  const {t, setCurrentLang, getCurrentFlag, currentLang} = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null)
  const [userInitiated, setUserInitiated] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isLanguageButton = target.closest('[role="menuitem"]')

      if (isLanguageButton) {
        return
      }

      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (error && error !== lastErrorMessage && userInitiated) {
      showError(error)
      setLastErrorMessage(error)
    }
  }, [error, lastErrorMessage, showError, userInitiated])

  const handleConnect = async () => {
    setUserInitiated(true)
    const isConnected = await connect()

    if (!isConnected) {
      showError(t('wallet_connect_error' as const))
    } else {
      success(t('wallet_connect_success' as const))
    }
  }

  const handleDisconnect = async () => {
    setUserInitiated(true)
    const isDisconnected = await disconnect()

    if (isDisconnected) {
      success(t('wallet_disconnect_success' as const))
      setIsProfileOpen(false)
    } else {
      showError(t('wallet_disconnect_error' as const))
    }
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const handleLanguageChange = (lang: 'en' | 'fr' | 'de') => {
    setCurrentLang(lang)
    setIsLangMenuOpen(false)
  }

  return (
    <header className='fixed top-0 left-0 right-0 border-b border-dark-700 bg-dark-900 text-white w-full z-50 transition-all duration-300'>
      <div className='w-full px-4 sm:px-6 lg:px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex-shrink-0'>
            <Logo />
          </div>

          <DesktopNavigation t={t} closeMenu={closeMenu} />

          {/* Desktop Actions */}
          <div className='hidden lg:flex items-center space-x-6'>
            <LanguageSelector isOpen={isLangMenuOpen} setIsOpen={setIsLangMenuOpen} currentLang={currentLang} handleLanguageChange={handleLanguageChange} getCurrentFlag={getCurrentFlag} langMenuRef={langMenuRef} />

            <SocialLinks />

            {blockchainId ? (
              <ProfileDropdown isOpen={isProfileOpen} blockchainId={blockchainId} t={t} handleDisconnect={handleDisconnect} setIsOpen={setIsProfileOpen} profileDropdownRef={profileDropdownRef} />
            ) : (
              <button onClick={handleConnect} className='px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20'>
                {t('connect_wallet' as const)}
              </button>
            )}
          </div>

          {/* Mobile Menu Controls */}
          <div className='lg:hidden flex items-center space-x-2'>
            <LanguageSelector isOpen={isLangMenuOpen} setIsOpen={setIsLangMenuOpen} currentLang={currentLang} handleLanguageChange={handleLanguageChange} getCurrentFlag={getCurrentFlag} langMenuRef={langMenuRef} />

            <button onClick={toggleMenu} className='p-2 rounded-lg hover:bg-dark-800 transition-colors z-50' aria-label='Toggle menu'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                {isMenuOpen ? <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /> : <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} blockchainId={blockchainId} t={t} closeMenu={closeMenu} handleConnect={handleConnect} handleDisconnect={handleDisconnect} />
    </header>
  )
}

export default Header