import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { allTranslations, Language, TranslationKey, TranslationValue, Translations } from '../translations'
import { getBrowserLanguage, supportedLanguages } from '../utils/language'

export type AppRouteKey = keyof typeof allTranslations.en._routeSegments;

interface TranslationContextType {
  currentLang: Language
  setCurrentLang: (lang: Language) => void
  syncLangWithUrl: (langFromUrl: Language | undefined) => void
  t: (key: TranslationKey, params?: Record<string, string | number | boolean>) => string
  tReady: boolean
  allTranslations: Record<Language, Translations>
  generateLocalizedPath: (routeKey: AppRouteKey, params?: Record<string, string | number>) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

const stripLangPrefix = (pathname: string, langs: Language[]): string => {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0 && langs.includes(segments[0] as Language)) {
    segments.shift() // Remove the first segment if it's a language code
  }
  return segments.length > 0 ? '/' + segments.join('/') : '/'
}

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [tReady, setTReady] = useState(false)
  
  const [currentLang, _setCurrentLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && supportedLanguages.includes(savedLang)) {
      return savedLang;
    }
    return getBrowserLanguage();
  });

  useEffect(() => {
    if (!tReady) setTReady(true);

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const langFromUrlSegment = pathSegments[0] as Language | undefined;

    if (!langFromUrlSegment || !supportedLanguages.includes(langFromUrlSegment)) {
      const purePath = stripLangPrefix(location.pathname, supportedLanguages);
      const newUrl = `/${currentLang}${purePath === '/' ? '' : purePath}`;
      if (location.pathname !== newUrl) {
        navigate(newUrl, { replace: true });
      }
    } 
  }, [location.pathname, navigate, currentLang, tReady]);

  const setCurrentLang = (selectedLang: Language) => {
    if (supportedLanguages.includes(selectedLang) && selectedLang !== currentLang) {
      const purePath = stripLangPrefix(location.pathname, supportedLanguages);
      const newUrl = `/${selectedLang}${purePath === '/' ? '' : purePath}`;
      navigate(newUrl);
    }
  };

  const syncLangWithUrl = (langFromUrl: Language | undefined) => {
    let langToSet: Language | null = null;

    if (langFromUrl && supportedLanguages.includes(langFromUrl)) {
      if (langFromUrl !== currentLang) {
        langToSet = langFromUrl;
      }
      const purePath = stripLangPrefix(location.pathname, supportedLanguages);
      const canonicalUrl = `/${langFromUrl}${purePath === '/' ? '' : purePath}`;
      if (location.pathname !== canonicalUrl) {
        navigate(canonicalUrl, { replace: true });
      }
    } else {
      const purePath = stripLangPrefix(location.pathname, supportedLanguages);
      navigate(`/${currentLang}${purePath === '/' ? '' : purePath}`, { replace: true });
    }

    if (langToSet && langToSet !== currentLang) {
      _setCurrentLang(langToSet);
      localStorage.setItem('language', langToSet);
    }
    if (!tReady) setTReady(true);
  };

  const t = (key: TranslationKey, tParams?: Record<string, string | number | boolean>): string => {
    const translationSet = allTranslations[currentLang] || allTranslations['en']
    const translationValue: TranslationValue | undefined = translationSet[key]

    if (translationValue === undefined) {
      console.warn(`Translation not found for key: "${key}" in language: "${currentLang}"`)
      return key.toString() 
    }

    type TranslationFunctionType = (params: Record<string, string | number | boolean>) => string;
    if (typeof translationValue === 'function') {
      return (translationValue as TranslationFunctionType)(tParams || {});
    }
    
    if (Array.isArray(translationValue)) {
      return translationValue.join('\n') 
    }
    
    if (typeof translationValue === 'string') {
      if (tParams) {
        return translationValue.replace(/\{(\w+)\}/g, (_, k) => {
          const value = tParams[k]
          return typeof value !== 'undefined' ? value.toString() : `{${k}}`
        })
      }
      return translationValue
    }

    console.error(`Unexpected translation type for key: "${key}". Type: ${typeof translationValue}`)
    return key.toString() 
  }

  const generateLocalizedPath = (routeKey: AppRouteKey, params?: Record<string, string | number>): string => {
    if (!tReady) {
      return `/${currentLang}/${routeKey as string}`;
    }

    const langSegments = allTranslations[currentLang]?._routeSegments;
    const enSegments = allTranslations.en._routeSegments;

    let segmentValue: string | undefined;

    if (langSegments && langSegments[routeKey as string] !== undefined) {
      segmentValue = langSegments[routeKey as string];
    } else if (enSegments && enSegments[routeKey as string] !== undefined) {
      segmentValue = enSegments[routeKey as string];
    } else {
      return `/${currentLang}/${routeKey as string}`;
    }

    let path = segmentValue;

    if (params) {
      Object.entries(params).forEach(([paramName, paramValue]) => {
        if (routeKey === 'collection_details' && paramName === 'id') path = `${segmentValue}/${paramValue}`;
        if (routeKey === 'mint' && paramName === 'category' && paramValue && params.id) path = `${segmentValue}/${paramValue}/${params.id}`;
      });
    }
    
    if (routeKey === 'home' && path === '') {
        return `/${currentLang}`;
    }

    return `/${currentLang}/${path}`;
  };

  return (
    <TranslationContext.Provider value={{ currentLang, setCurrentLang, syncLangWithUrl, t, tReady, allTranslations, generateLocalizedPath }}>
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