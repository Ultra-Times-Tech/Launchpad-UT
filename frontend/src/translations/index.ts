import fr from './fr'
import en from './en'
import de from './de'
import { Language, Translations } from '../types/translations.types'

export const allTranslations: Record<Language, Translations> = {
  fr,
  en,
  de
}

export * from '../types/translations.types' 