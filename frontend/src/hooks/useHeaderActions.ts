import {useState, useEffect, useRef} from 'react'
import {useUltraWallet} from '../utils/ultraWalletHelper'
import useAlerts from './useAlert'
import {TranslationFunction} from '../types/header.types'

export const useHeaderActions = (t: TranslationFunction) => {
  const {blockchainId, connect, disconnect, error} = useUltraWallet()
  const {success, error: showError} = useAlerts()
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

  return {
    blockchainId,
    isMenuOpen,
    isProfileOpen,
    isLangMenuOpen,
    profileDropdownRef,
    langMenuRef,
    handleConnect,
    handleDisconnect,
    toggleMenu,
    closeMenu,
    setIsProfileOpen,
    setIsLangMenuOpen,
  }
}
