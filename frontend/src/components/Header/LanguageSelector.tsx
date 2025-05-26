import LanguageButton from './LanguageButton'
import {LanguageSelectorProps} from '../../types/header.types'
import {useTranslation} from '../../contexts/TranslationContext'
import {Language} from '../../types/translations.types'

const LanguageSelector = ({isOpen, setIsOpen, getCurrentFlag, langMenuRef}: LanguageSelectorProps) => {
  const {currentLang, setCurrentLang} = useTranslation()

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang)
    setIsOpen(false) // Close dropdown after selection
  }

  return (
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
            <LanguageButton key={lang} lang={lang as Language} isActive={currentLang === lang} onClick={() => handleLanguageChange(lang as Language)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
