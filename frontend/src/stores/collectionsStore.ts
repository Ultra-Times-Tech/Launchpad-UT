import {create} from 'zustand'
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
}

export const useCollectionsStore = create<CollectionsState>(set => ({
  UNIQs: [],
  allCollections: [],
  featuredCollections: [],
  trendingCollections: [],
  loading: false,
  error: null,
  fetchCollections: async () => {
    try {
      set({loading: true, error: null})

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
      set({
        loading: false,
        error: 'Failed to load data. Please try again later.',
      })
    }
  },
}))