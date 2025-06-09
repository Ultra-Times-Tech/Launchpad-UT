import {useTranslation} from '../hooks/useTranslation'
import {useHeaderActions} from '../hooks/useHeaderActions'
import {useUserCheck} from '../hooks/useUserCheck'
import Logo from './Header/Logo'
import DesktopNavigation from './Header/DesktopNavigation'
import LanguageSelector from './Header/LanguageSelector'
import SocialLinks from './Header/SocialLinks'
import ProfileDropdown from './Header/ProfileDropdown'
import MobileMenu from './Header/MobileMenu'

const Header = () => {
  const {t, setCurrentLang, getCurrentFlag, currentLang} = useTranslation()

  const {blockchainId, isMenuOpen, isProfileOpen, isLangMenuOpen, profileDropdownRef, langMenuRef, handleConnect, handleDisconnect, toggleMenu, closeMenu, setIsProfileOpen, setIsLangMenuOpen} = useHeaderActions(t)

  // Vérification utilisateur avec le hook personnalisé
  useUserCheck(blockchainId, t)

  const handleLanguageChange = (lang: 'en' | 'fr' | 'de') => {
    setCurrentLang(lang)
    setIsLangMenuOpen(false)
  }

  return (
    <header className='fixed top-0 left-0 right-0 border-b border-dark-700 bg-[#121315] text-white w-full z-50 transition-all duration-300'>
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
              <ProfileDropdown isOpen={isProfileOpen} blockchainId={blockchainId} handleDisconnect={handleDisconnect} setIsOpen={setIsProfileOpen} profileDropdownRef={profileDropdownRef} />
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
