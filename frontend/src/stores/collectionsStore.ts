import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import {Collection, FeaturedCollectionCardProps, TrendingCollection, NFT} from '../types/collection.types'
import {collectionsService} from '../services/collections.service'

interface CollectionsState {
  UNIQs: NFT[]
  allCollections: Collection[]
  featuredCollections: FeaturedCollectionCardProps[]
  trendingCollections: TrendingCollection[]
  loading: boolean
  error: string | null
  fetchCollections: () => Promise<void>
  _hasHydrated: boolean
  setHasHydrated: (hydrated: boolean) => void
}

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    set => ({
      UNIQs: [],
      allCollections: [],
      featuredCollections: [],
      trendingCollections: [],
      loading: true,
      error: null,
      _hasHydrated: false,
      setHasHydrated: (hydrated: boolean) => set({_hasHydrated: hydrated}),
      fetchCollections: async () => {
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
    }),
    {
      name: 'collections-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => state => {
        if (state) {
          state.setHasHydrated(true)
          if (state.allCollections.length > 0) {
            state.loading = false
          }
        }
      },
    }
  )
)