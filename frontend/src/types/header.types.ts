import {TranslationKey} from './translations'

export interface SocialLinkProps {
  href: string
  icon: JSX.Element
}

export interface LanguageButtonProps {
  lang: 'en' | 'fr' | 'de'
  isActive: boolean
  onClick: (lang: 'en' | 'fr' | 'de') => void
}

export type TranslationFunction = (key: TranslationKey) => string

export interface LanguageSelectorProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  currentLang: string
  handleLanguageChange: (lang: 'en' | 'fr' | 'de') => void
  getCurrentFlag: () => JSX.Element
  langMenuRef: React.RefObject<HTMLDivElement>
}

export interface ProfileDropdownProps {
  isOpen: boolean
  blockchainId: string
  t: TranslationFunction
  handleDisconnect: () => void
  setIsOpen: (isOpen: boolean) => void
  profileDropdownRef: React.RefObject<HTMLDivElement>
}

export interface MobileMenuProps {
  isOpen: boolean
  blockchainId: string | null
  t: TranslationFunction
  closeMenu: () => void
  handleConnect: () => void
  handleDisconnect: () => void
}

export interface DesktopNavigationProps {
  t: TranslationFunction
  closeMenu: () => void
}
