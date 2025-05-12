import {useState, useEffect} from 'react'
import {Collection, FeaturedCollectionCardProps, TrendingCollection, NFT} from '../types/collection.types'
import {collectionsService} from '../services/collections.service'

export function useCollections() {
  const [UNIQs, setUNIQs] = useState<NFT[]>([])
  const [allCollections, setAllCollections] = useState<Collection[]>([])
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollectionCardProps[]>([])
  const [trendingCollections, setTrendingCollections] = useState<TrendingCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch collections using the dedicated service
        const collections = await collectionsService.getAllCollections()
        setAllCollections(collections)
        
        // Get featured collections
        const featured = await collectionsService.getFeaturedCollections()
        setFeaturedCollections(featured)
        
        // Get trending collections
        const trending = await collectionsService.getTrendingCollections()
        setTrendingCollections(trending)
        
        setError(null)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    UNIQs,
    allCollections,
    featuredCollections,
    trendingCollections,
    loading,
    error,
  }
}