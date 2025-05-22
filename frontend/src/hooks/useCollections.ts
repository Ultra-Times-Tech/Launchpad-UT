import {useEffect} from 'react'
import {useCollectionsStore} from '../stores/collectionsStore'

export function useCollections() {
  const {UNIQs, allCollections, featuredCollections, trendingCollections, loading, error, fetchCollections} = useCollectionsStore()

  useEffect(() => {
    if (allCollections.length === 0 && loading && !error) {
      fetchCollections()
    }
  }, [allCollections.length, loading, error, fetchCollections])

  return {
    UNIQs,
    allCollections,
    featuredCollections,
    trendingCollections,
    loading,
    error,
  }
}