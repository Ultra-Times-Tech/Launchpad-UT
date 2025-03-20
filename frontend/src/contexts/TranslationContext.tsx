import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language, TranslationKey } from '../translations'

interface TranslationContextType {
  currentLang: Language
  setCurrentLang: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

const getBrowserLanguage = (): Language => {
  const lang = navigator.language.toLowerCase().split('-')[0]
  if (lang === 'fr' || lang === 'en' || lang === 'de') {
    return lang as Language
  }
  return 'en'
}

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  return (
    <TranslationContext.Provider value={{ currentLang, setCurrentLang, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
} 