// Configuration du cache et du polling pour les collections
export const CACHE_CONFIG = {
  // Durée de vie du cache en millisecondes (5 minutes par défaut)
  TTL: 5 * 60 * 1000,
  
  // Intervalle de polling en millisecondes (30 secondes par défaut)
  POLLING_INTERVAL: 30 * 1000,
  
  // Active/désactive le polling automatique
  ENABLE_POLLING: true,
  
  // Active/désactive la vérification de visibilité de la page
  ENABLE_VISIBILITY_CHECK: true,
  
  // Délai avant de démarrer le polling après l'hydratation (en ms)
  POLLING_DELAY: 2000,
} as const

// Configuration pour différents environnements
export const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isDevelopment) {
    return {
      ...CACHE_CONFIG,
      // En développement, cache plus court et polling plus fréquent
      TTL: 2 * 60 * 1000, // 2 minutes
      POLLING_INTERVAL: 15 * 1000, // 15 secondes
    }
  }
  
  if (isProduction) {
    return {
      ...CACHE_CONFIG,
      // En production, cache plus long et polling moins fréquent
      TTL: 10 * 60 * 1000, // 10 minutes
      POLLING_INTERVAL: 60 * 1000, // 1 minute
    }
  }
  
  return CACHE_CONFIG
} 