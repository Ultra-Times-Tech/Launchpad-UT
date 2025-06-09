import {useEffect, useState} from 'react'
import {useCollectionsStore} from '../stores/collectionsStore'
import {CollectionDetailsProps, Collection} from '../types/collection.types'
import {getMockFactories} from '../data/collections.data'

// Fonction pour construire les détails à partir d'une collection de base
const buildDetailsFromCollection = (collection: Collection): CollectionDetailsProps => {
  return {
    id: collection.attributes.id,
    name: collection.attributes.name,
    description: collection.attributes.content || 'A collection of unique digital assets from the Ultra Times ecosystem.',
    image: collection.attributes.image || '/banners/vit-banner.png',
    totalItems: 1000,
    floorPrice: '0.5 UOS',
    creator: 'Ultra Times',
    releaseDate: new Date(collection.attributes.modified).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    features: [
      'Each item has unique attributes and features',
      'Items can be used in the Ultra Times ecosystem',
      'Rare and legendary items include special benefits',
      'Owners receive exclusive access to special events',
      'Limited edition items with enhanced capabilities',
      'Blockchain-verified ownership and authenticity'
    ],
    factories: getMockFactories(collection.attributes.id),
  }
}

export function useCollectionDetails(id: string) {
  const {
    allCollections,
    fetchCollectionDetails,
    getCollectionDetails,
    saveCollectionDetails,
    isCollectionDetailsStale,
    _hasHydrated
  } = useCollectionsStore()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Récupérer les données depuis le cache
  const cachedDetails = getCollectionDetails(id)
  const [details, setDetails] = useState<CollectionDetailsProps | null>(cachedDetails)

  useEffect(() => {
    const loadDetails = async () => {
      if (!_hasHydrated || !id) return

      const numericId = parseInt(id)

      // 1. D'abord, vérifier si on a des détails en cache et qu'ils ne sont pas obsolètes
      const cached = getCollectionDetails(id)
      if (cached && !isCollectionDetailsStale(id)) {
        setDetails(cached)
        setLoading(false)
        return
      }

      // 2. Ensuite, essayer de construire les détails à partir des collections existantes
      const existingCollection = allCollections.find(col => col.attributes.id === numericId)
      if (existingCollection) {
        const builtDetails = buildDetailsFromCollection(existingCollection)
        setDetails(builtDetails)
        setLoading(false)
        
        // Sauvegarder ces détails construits dans le cache pour éviter de les reconstruire
        saveCollectionDetails(id, builtDetails)
        
        return
      }

      // 3. Si on a des détails en cache mais obsolètes, les afficher immédiatement
      if (cached) {
        setDetails(cached)
        setLoading(false) // Pas de loading visible
      } else {
        setLoading(true) // Loading seulement si pas de données du tout
      }

      setError(null)

      // 4. En dernier recours, faire un appel API
      try {
        const result = await fetchCollectionDetails(id)
        if (result) {
          setDetails(result)
        } else {
          setError('Collection not found')
        }
      } catch (err) {
        console.error('Error loading collection details:', err)
        if (!cached && !existingCollection) {
          setError('Failed to load collection details')
        }
        // Si on a des données (cache ou construites), on les garde même en cas d'erreur
      } finally {
        setLoading(false)
      }
    }

    loadDetails()
  }, [id, _hasHydrated, allCollections, fetchCollectionDetails, getCollectionDetails, saveCollectionDetails, isCollectionDetailsStale])

  // Mettre à jour les détails si le cache change
  useEffect(() => {
    const cached = getCollectionDetails(id)
    if (cached && cached !== details) {
      setDetails(cached)
    }
  }, [id, getCollectionDetails, details])

  return {
    details,
    loading,
    error,
  }
} 