import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import {Collection, FeaturedCollectionCardProps, TrendingCollection, NFT, CollectionDetailsProps} from '../types/collection.types'
import {collectionsService} from '../services/collections.service'
import {getEnvironmentConfig} from '../config/cache.config'

interface CollectionsState {
  UNIQs: NFT[]
  allCollections: Collection[]
  featuredCollections: FeaturedCollectionCardProps[]
  trendingCollections: TrendingCollection[]
  collectionDetails: Record<string, {data: CollectionDetailsProps, lastFetchTime: number}>
  loading: boolean
  error: string | null
  lastFetchTime: number | null
  fetchCollections: () => Promise<void>
  refreshCollections: () => Promise<void>
  fetchCollectionDetails: (id: string) => Promise<CollectionDetailsProps | null>
  getCollectionDetails: (id: string) => CollectionDetailsProps | null
  saveCollectionDetails: (id: string, details: CollectionDetailsProps) => void
  isDataStale: () => boolean
  isCollectionDetailsStale: (id: string) => boolean
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
      collectionDetails: {},
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
        if (currentState.loading) {
          return
        }

        // Si on a déjà des données en cache, on ne montre pas l'état de chargement
        // On fait un refresh silencieux en arrière-plan
        const hasExistingData = currentState.allCollections.length > 0
        
        if (!hasExistingData) {
          set({loading: true, error: null})
        } else {
          // Refresh silencieux - on garde les données actuelles et on ne montre pas de loading
          set({error: null})
        }

        try {
          const collections = await collectionsService.getAllCollections()
          const featured = await collectionsService.getFeaturedCollections()
          const trending = await collectionsService.getTrendingCollections()

          // Vérifie s'il y a des changements avant de mettre à jour (même logique que refreshCollections)
          const hasChanges = !hasExistingData || 
            JSON.stringify(collections) !== JSON.stringify(currentState.allCollections) || 
            JSON.stringify(featured) !== JSON.stringify(currentState.featuredCollections) || 
            JSON.stringify(trending) !== JSON.stringify(currentState.trendingCollections)

          if (hasChanges || !hasExistingData) {
            set({
              allCollections: collections,
              featuredCollections: featured,
              trendingCollections: trending,
              loading: false,
              error: null,
              lastFetchTime: Date.now(),
            })
          } else {
            // Pas de changements, on met juste à jour le timestamp et on retire le loading
            set({
              loading: false,
              lastFetchTime: Date.now(),
            })
          }
        } catch (error) {
          console.error('Error fetching data:', error)
          const errorMessage = error instanceof Error ? error.message : 'Failed to load data. Please try again later.'
          
          // Si on avait des données existantes, on les garde et on ne montre pas l'erreur
          if (hasExistingData) {
            console.warn('⚠️ Erreur lors du refresh, conservation des données en cache')
            set({loading: false}) // On retire juste le loading
          } else {
            // Pas de données existantes, on montre l'erreur
            set({
              loading: false,
              error: errorMessage,
            })
          }
        }
      },

      // Rafraîchissement forcé des collections
      refreshCollections: async () => {
        const currentState = get()

        // Garde les données actuelles pendant le refresh pour éviter le flicker
        set({error: null})

        try {
          const collections = await collectionsService.getAllCollections()
          const featured = await collectionsService.getFeaturedCollections()
          const trending = await collectionsService.getTrendingCollections()

          // Vérifie s'il y a des changements avant de mettre à jour
          const hasChanges = JSON.stringify(collections) !== JSON.stringify(currentState.allCollections) || JSON.stringify(featured) !== JSON.stringify(currentState.featuredCollections) || JSON.stringify(trending) !== JSON.stringify(currentState.trendingCollections)

          if (hasChanges) {
            set({
              allCollections: collections,
              featuredCollections: featured,
              trendingCollections: trending,
              lastFetchTime: Date.now(),
            })
          } else {
            // IMPORTANT: Même sans changements, on met à jour le lastFetchTime
            // pour éviter que le polling se déclenche à chaque intervalle
            set({
              lastFetchTime: Date.now(),
            })
          }
        } catch (error) {
          console.error('❌ Erreur lors du refresh:', error)
          // En cas d'erreur, on ne met pas à jour le timestamp pour retry plus tard
        }
      },

      // Vérifie si les détails d'une collection sont obsolètes
      isCollectionDetailsStale: (id: string) => {
        const {collectionDetails} = get()
        const details = collectionDetails[id]
        if (!details) return true
        return Date.now() - details.lastFetchTime > CACHE_TTL
      },

      // Récupère les détails d'une collection depuis le cache
      getCollectionDetails: (id: string) => {
        const {collectionDetails} = get()
        const details = collectionDetails[id]
        return details?.data || null
      },

      // Sauvegarde des détails construits dans le cache
      saveCollectionDetails: (id: string, details: CollectionDetailsProps) => {
        set(state => ({
          collectionDetails: {
            ...state.collectionDetails,
            [id]: {
              data: details,
              lastFetchTime: Date.now()
            }
          }
        }))
      },

      // Récupère les détails d'une collection avec cache intelligent
      fetchCollectionDetails: async (id: string) => {
        const currentState = get()
        
        // Si les données ne sont pas obsolètes, retourner depuis le cache
        if (!currentState.isCollectionDetailsStale(id)) {
          return currentState.getCollectionDetails(id)
        }

        try {
          const collectionDetails = await collectionsService.getCollectionDetails(id)
          
          if (collectionDetails) {
            // Mettre à jour le cache
            set(state => ({
              collectionDetails: {
                ...state.collectionDetails,
                [id]: {
                  data: collectionDetails,
                  lastFetchTime: Date.now()
                }
              }
            }))
            
            return collectionDetails
          }
          
          return null
        } catch (error) {
          console.error(`Error fetching collection details ${id}:`, error)
          // En cas d'erreur, retourner les données en cache si disponibles
          return currentState.getCollectionDetails(id)
        }
      },
    }),
    {
      name: 'collections-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        allCollections: state.allCollections,
        featuredCollections: state.featuredCollections,
        trendingCollections: state.trendingCollections,
        collectionDetails: state.collectionDetails,
        lastFetchTime: state.lastFetchTime,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.setHasHydrated(true)
          // Toujours s'assurer que loading est à false après réhydratation
          // Les données en cache sont immédiatement disponibles, même si obsolètes
          state.loading = false
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
