import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import {Collection, FeaturedCollectionCardProps, TrendingCollection, NFT} from '../types/collection.types'
import {collectionsService} from '../services/collections.service'
import {getEnvironmentConfig} from '../config/cache.config'

interface CollectionsState {
  UNIQs: NFT[]
  allCollections: Collection[]
  featuredCollections: FeaturedCollectionCardProps[]
  trendingCollections: TrendingCollection[]
  loading: boolean
  error: string | null
  lastFetchTime: number | null
  fetchCollections: () => Promise<void>
  refreshCollections: () => Promise<void>
  isDataStale: () => boolean
  _hasHydrated: boolean
  setHasHydrated: (hydrated: boolean) => void
}

// Configuration du cache basée sur l'environnement
const CONFIG = getEnvironmentConfig()
const CACHE_TTL = CONFIG.TTL
const POLLING_INTERVAL = CONFIG.POLLING_INTERVAL

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set, get) => ({
      UNIQs: [],
      allCollections: [],
      featuredCollections: [],
      trendingCollections: [],
      loading: false,
      error: null,
      lastFetchTime: null,
      _hasHydrated: false,
      setHasHydrated: (hydrated: boolean) => set({_hasHydrated: hydrated}),
      
      // Vérifie si les données sont obsolètes
      isDataStale: () => {
        const {lastFetchTime} = get()
        if (!lastFetchTime) return true
        return Date.now() - lastFetchTime > CACHE_TTL
      },

      // Récupération initiale des collections
      fetchCollections: async () => {
        const currentState = get()
        
        // Si les données ne sont pas obsolètes et qu'on a déjà des collections, ne pas refetch
        if (!currentState.isDataStale() && currentState.allCollections.length > 0) {
          set({loading: false})
          return
        }

        // Évite de refetch si déjà en cours de chargement
        if (currentState.loading && currentState.allCollections.length === 0) {
          return
        }

        set({loading: true, error: null})
        try {
          const collections = await collectionsService.getAllCollections()
          const featured = await collectionsService.getFeaturedCollections()
          const trending = await collectionsService.getTrendingCollections()

          set({
            allCollections: collections,
            featuredCollections: featured,
            trendingCollections: trending,
            loading: false,
            error: null,
            lastFetchTime: Date.now(),
          })
        } catch (error) {
          console.error('Error fetching data:', error)
          const errorMessage = error instanceof Error ? error.message : 'Failed to load data. Please try again later.'
          set({
            loading: false,
            error: errorMessage,
          })
        }
      },

      // Rafraîchissement forcé des collections
      refreshCollections: async () => {
        const currentState = get()
        
        console.log('🔄 Polling démarré - Vérification des mises à jour...')
        
        // Garde les données actuelles pendant le refresh pour éviter le flicker
        set({error: null})
        
        try {
          const collections = await collectionsService.getAllCollections()
          const featured = await collectionsService.getFeaturedCollections()
          const trending = await collectionsService.getTrendingCollections()

          console.log('📡 Données récupérées depuis l\'API')

          // Vérifie s'il y a des changements avant de mettre à jour
          const hasChanges = 
            JSON.stringify(collections) !== JSON.stringify(currentState.allCollections) ||
            JSON.stringify(featured) !== JSON.stringify(currentState.featuredCollections) ||
            JSON.stringify(trending) !== JSON.stringify(currentState.trendingCollections)

          if (hasChanges) {
            set({
              allCollections: collections,
              featuredCollections: featured,
              trendingCollections: trending,
              lastFetchTime: Date.now(),
            })
            console.log('✅ Collections mises à jour avec de nouvelles données')
          } else {
            console.log('ℹ️ Aucun changement détecté - Interface non mise à jour')
          }
        } catch (error) {
          console.error('❌ Erreur lors du refresh:', error)
          // Ne pas mettre d'erreur pour un refresh en arrière-plan
        }
      },
    }),
    {
      name: 'collections-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        allCollections: state.allCollections,
        featuredCollections: state.featuredCollections,
        trendingCollections: state.trendingCollections,
        lastFetchTime: state.lastFetchTime,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.setHasHydrated(true)
          // Si on a des données en cache et qu'elles ne sont pas obsolètes, pas besoin de loader
          if (state.allCollections.length > 0 && !state.isDataStale()) {
            state.loading = false
          } else if (state.allCollections.length === 0) {
            // Si pas de données en cache, on va devoir fetch
            state.loading = false
          }
        }
      },
    }
  )
)

// Service de polling en arrière-plan
class CollectionsPollingService {
  private intervalId: NodeJS.Timeout | null = null
  private isActive = false
  private isPageVisible = true

  start() {
    if (this.isActive) return
    
    this.isActive = true
    
    // Écoute les changements de visibilité de la page
    this.setupVisibilityListener()
    
    this.intervalId = setInterval(() => {
      // Ne polling que si la page est visible
      if (!this.isPageVisible) return
      
      const store = useCollectionsStore.getState()
      if (store._hasHydrated && store.isDataStale()) {
        store.refreshCollections()
      }
    }, POLLING_INTERVAL)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isActive = false
    this.removeVisibilityListener()
  }

  private setupVisibilityListener() {
    const handleVisibilityChange = () => {
      const wasHidden = !this.isPageVisible
      this.isPageVisible = !document.hidden
      
      // Si la page redevient visible après avoir été cachée, force un refresh
      if (wasHidden && this.isPageVisible) {
        const store = useCollectionsStore.getState()
        if (store._hasHydrated && store.isDataStale()) {
          store.refreshCollections()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    this.visibilityHandler = handleVisibilityChange
  }

  private removeVisibilityListener() {
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler)
    }
  }

  private visibilityHandler: (() => void) | null = null
}

export const collectionsPollingService = new CollectionsPollingService()