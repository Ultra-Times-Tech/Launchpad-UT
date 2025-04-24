import {apiRequestor} from '../utils/axiosInstanceHelper'
import {Collection, CollectionResponse, FeaturedCollectionCardProps, TrendingCollection, CollectionDetailsProps} from '../types/collection.types'
import {getMockFactories} from '../data/collections.data'

class CollectionsService {
  async getAllCollections(): Promise<Collection[]> {
    try {
      const response = await apiRequestor.get<CollectionResponse>('/collections')
      return Array.isArray(response.data.data) ? response.data.data : [response.data.data]
    } catch (error) {
      console.error('Error fetching collections:', error)
      return []
    }
  }
  
  async getCollectionById(id: string): Promise<Collection | null> {
    try {
      const response = await apiRequestor.get<CollectionResponse>(`/collections/${id}`)
      return response.data.data as Collection
    } catch (error) {
      console.error(`Error fetching collection ${id}:`, error)
      return null
    }
  }
  
  async getFeaturedCollections(): Promise<FeaturedCollectionCardProps[]> {
    try {
      const collections = await this.getAllCollections()
      
      return collections
        .filter(collection => collection.attributes.is_featured)
        .map(collection => ({
          id: collection.attributes.id,
          name: collection.attributes.name,
          description: 'Collection description...', 
          image: collection.attributes.image || '/banners/default-banner.png',
          artist: 'Ultra Times',
          date: new Date(collection.attributes.modified).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          totalItems: 1000,
          floorPrice: '0.5 ETH',
          comingSoon: collection.attributes.state === 0,
        }))
    } catch (error) {
      console.error('Error fetching featured collections:', error)
      return []
    }
  }
  
  async getTrendingCollections(): Promise<TrendingCollection[]> {
    try {
      const collections = await this.getAllCollections()
      
      return collections
        .filter(collection => collection.attributes.is_trending)
        .map(collection => ({
          id: collection.attributes.id,
          name: collection.attributes.name,
          description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem, carefully crafted for maximum impact.',
          image: collection.attributes.image || 'https://picsum.photos/400/300?random=11',
          artist: 'Ultra Times',
          totalItems: 500,
          floorPrice: '0.4 ETH',
          category: 'Power Boosters',
        }))
    } catch (error) {
      console.error('Error fetching trending collections:', error)
      return []
    }
  }
  
  async getCollectionDetails(id: string): Promise<CollectionDetailsProps | null> {
    try {
      const collection = await this.getCollectionById(id)
      
      if (!collection) return null
      
      return {
        id: collection.attributes.id,
        name: collection.attributes.name,
        description: 'A collection of unique digital assets from the Ultra Times ecosystem.',
        image: collection.attributes.image || '/banners/vit-banner.png',
        totalItems: 1000,
        floorPrice: '0.5 ETH',
        creator: 'Ultra Times',
        releaseDate: new Date(collection.attributes.modified).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        features: [
          'Each item has unique attributes and features',
          'Items can be used in the Ultra Times ecosystem',
          'Rare and legendary items include special benefits',
          'Owners receive exclusive access to special events',
          'Limited edition items with enhanced capabilities',
          'Blockchain-verified ownership and authenticity'
        ],
        factories: getMockFactories(collection.attributes.id)
      }
    } catch (error) {
      console.error(`Error fetching collection details ${id}:`, error)
      return null
    }
  }
}

export const collectionsService = new CollectionsService() 