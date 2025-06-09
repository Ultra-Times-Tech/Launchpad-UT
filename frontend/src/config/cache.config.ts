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
      // En développement, cache court et polling fréquent pour tester
      TTL: 30 * 1000, // 30 secondes - très rapide pour le dev
      POLLING_INTERVAL: 5 * 1000, // 5 secondes - quasi temps réel
    }
  }
  
  if (isProduction) {
    return {
      ...CACHE_CONFIG,
      // En production, bon compromis réactivité/performance
      TTL: 2 * 60 * 1000, // 2 minutes - cache raisonnable
      POLLING_INTERVAL: 15 * 1000, // 15 secondes - réactif sans être agressif
    }
  }
  
  return CACHE_CONFIG
} 