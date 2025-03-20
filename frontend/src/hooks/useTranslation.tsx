/** @jsx React.createElement */
import { useState, ReactElement, useEffect } from 'react'

type Language = 'fr' | 'en' | 'de'

type TranslationKey = 'home' | 'collections' | 'authors' | 'shop' | 'contact' | 'connect_wallet' | 'profile_settings' | 'my_collections' | 'disconnect' | 'connected_wallet' | 'wallet_connect_error' | 'wallet_connect_success' | 'wallet_disconnect_error' | 'wallet_disconnect_success'

interface TranslationDictionary {
  fr: { [key in TranslationKey]: string }
  en: { [key in TranslationKey]: string }
  de: { [key in TranslationKey]: string }
}

const translations: TranslationDictionary = {
  fr: {
    home: 'Accueil',
    collections: 'Collections',
    authors: 'Auteurs',
    shop: 'Boutique',
    contact: 'Contact',
    connect_wallet: 'Connecter le Wallet',
    profile_settings: 'Paramètres du Profil',
    my_collections: 'Mes Collections',
    disconnect: 'Déconnecter',
    connected_wallet: 'Wallet Connecté',
    wallet_connect_error: 'Échec de la connexion au wallet',
    wallet_connect_success: 'Wallet connecté avec succès !',
    wallet_disconnect_error: 'Échec de la déconnexion du wallet',
    wallet_disconnect_success: 'Wallet déconnecté avec succès !'
  },
  en: {
    home: 'Home',
    collections: 'Collections',
    authors: 'Authors',
    shop: 'Shop',
    contact: 'Contact',
    connect_wallet: 'Connect Wallet',
    profile_settings: 'Profile Settings',
    my_collections: 'My Collections',
    disconnect: 'Disconnect',
    connected_wallet: 'Connected Wallet',
    wallet_connect_error: 'Failed to connect wallet',
    wallet_connect_success: 'Wallet connected successfully!',
    wallet_disconnect_error: 'Failed to disconnect wallet',
    wallet_disconnect_success: 'Wallet disconnected successfully!'
  },
  de: {
    home: 'Startseite',
    collections: 'Sammlungen',
    authors: 'Autoren',
    shop: 'Shop',
    contact: 'Kontakt',
    connect_wallet: 'Wallet Verbinden',
    profile_settings: 'Profileinstellungen',
    my_collections: 'Meine Sammlungen',
    disconnect: 'Trennen',
    connected_wallet: 'Wallet Verbunden',
    wallet_connect_error: 'Wallet-Verbindung fehlgeschlagen',
    wallet_connect_success: 'Wallet erfolgreich verbunden!',
    wallet_disconnect_error: 'Wallet-Trennung fehlgeschlagen',
    wallet_disconnect_success: 'Wallet erfolgreich getrennt!'
  }
}

interface UseTranslationReturn {
  t: (key: TranslationKey) => string
  currentLang: Language
  setCurrentLang: (lang: Language) => void
  getCurrentFlag: () => ReactElement
}

const FrenchFlag = () => (
  <svg className='w-6 h-4' viewBox='0 0 36 24'>
    <rect width='36' height='24' fill='#ED2939'/>
    <rect width='12' height='24' fill='#002395'/>
    <rect x='12' width='12' height='24' fill='#fff'/>
  </svg>
)

const EnglishFlag = () => (
  <svg className='w-6 h-4' viewBox='0 0 36 24'>
    <rect width='36' height='24' fill='#012169'/>
    <path d='M0,0 L36,24 M36,0 L0,24' stroke='#fff' strokeWidth='2.4'/>
    <path d='M18,0 L18,24 M0,12 L36,12' stroke='#fff' strokeWidth='4'/>
    <path d='M18,0 L18,24 M0,12 L36,12' stroke='#C8102E' strokeWidth='2.4'/>
  </svg>
)

const GermanFlag = () => (
  <svg className='w-6 h-4' viewBox='0 0 36 24'>
    <rect width='36' height='8' fill='#000'/>
    <rect y='8' width='36' height='8' fill='#DD0000'/>
    <rect y='16' width='36' height='8' fill='#FFCE00'/>
  </svg>
)

const getBrowserLanguage = (): Language => {
  const lang = navigator.language.toLowerCase().split('-')[0]
  if (lang === 'fr' || lang === 'en' || lang === 'de') {
    return lang as Language
  }
  return 'en' // Default to English if browser language is not supported
}

export const useTranslation = (): UseTranslationReturn => {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language
    return savedLang || getBrowserLanguage()
  })

  useEffect(() => {
    localStorage.setItem('language', currentLang)
  }, [currentLang])

  const t = (key: TranslationKey): string => {
    return translations[currentLang][key]
  }

  const getCurrentFlag = (): ReactElement => {
    switch (currentLang) {
      case 'fr':
        return <FrenchFlag />
      case 'en':
        return <EnglishFlag />
      case 'de':
        return <GermanFlag />
      default:
        return <EnglishFlag />
    }
  }

  return {
    t,
    currentLang,
    setCurrentLang,
    getCurrentFlag
  }
} 