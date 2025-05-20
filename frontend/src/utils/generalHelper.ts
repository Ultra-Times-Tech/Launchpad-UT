/**
 * Retourne le lien Twitter approprié en fonction de la langue
 * @param lang - La langue actuelle ('fr', 'de', 'en')
 * @returns Le lien Twitter correspondant à la langue
 */
export const getTwitterLink = (lang: string): string => {
  switch (lang) {
    case 'fr':
      return 'https://x.com/Ultra_Times'
    case 'de':
      return 'https://x.com/Ultra_TimesDE'
    default:
      return 'https://x.com/Ultra_TimesEN'
  }
} 