import {useEffect, useRef} from 'react'
import {useCollectionsStore, collectionsPollingService} from '../stores/collectionsStore'

export function useCollections() {
  const {
    UNIQs,
    allCollections,
    featuredCollections,
    trendingCollections,
    loading,
    error,
    fetchCollections,
    isDataStale,
    _hasHydrated
  } = useCollectionsStore()

  const hasInitialized = useRef(false)
  
  // Démarre le service de polling une seule fois
  useEffect(() => {
    collectionsPollingService.start()

    // Nettoyage : arrête le polling quand le composant est démonté
    return () => {
      collectionsPollingService.stop()
    }
  }, [])

  // Gère le fetch initial des collections - vérifie aussi si les données sont obsolètes
  useEffect(() => {
    if (_hasHydrated && !hasInitialized.current && (allCollections.length === 0 || isDataStale())) {
      hasInitialized.current = true
      fetchCollections()
    }
  }, [_hasHydrated, allCollections.length, isDataStale, fetchCollections])

  return {
    UNIQs,
    allCollections,
    featuredCollections,
    trendingCollections,
    loading,
    error,
  }
}