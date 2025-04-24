import {useState, useEffect} from 'react'
import {Collection, FeaturedCollectionCardProps, TrendingCollection, NFT} from '../types/collection.types'
import {collectionsService} from '../services/collections.service'
import {apiRequestor} from '../utils/axiosInstanceHelper'

export function useCollections() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [allCollections, setAllCollections] = useState<Collection[]>([])
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollectionCardProps[]>([])
  const [trendingCollections, setTrendingCollections] = useState<TrendingCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from backend...')
        
        // Fetch NFTs
        const nftResponse = await apiRequestor.get('/nfts')
        setNfts(nftResponse.data)

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
    nfts,
    allCollections,
    featuredCollections,
    trendingCollections,
    loading,
    error,
  }
}