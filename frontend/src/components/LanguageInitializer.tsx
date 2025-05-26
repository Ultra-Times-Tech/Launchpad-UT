import {useEffect} from 'react'
import {useParams, Outlet} from 'react-router-dom'
import {useTranslation} from '../contexts/TranslationContext'
import {supportedLanguages} from '../utils/language'
import {Language} from '../types/translations.types'

const LanguageInitializer: React.FC = () => {
  const {lang} = useParams<{lang?: string}>()
  const {syncLangWithUrl, currentLang: contextLang} = useTranslation()

  useEffect(() => {
    if (lang && supportedLanguages.includes(lang as Language)) {
      if (lang !== contextLang) {
        syncLangWithUrl(lang as Language)
      }
    } else {
      syncLangWithUrl(undefined)
    }
  }, [lang, contextLang, syncLangWithUrl])
  return <Outlet />
}

export default LanguageInitializer