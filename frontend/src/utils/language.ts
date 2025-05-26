import { Language } from '../types/translations.types';

export const supportedLanguages: Language[] = ['en', 'fr', 'de'];

export const getBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') {
    return 'en'; // Fallback for SSR or test environments
  }
  const lang = navigator.language.toLowerCase().split('-')[0];
  if (supportedLanguages.includes(lang as Language)) {
    return lang as Language;
  }
  return 'en'; // Default language if browser lang is not supported
}; 