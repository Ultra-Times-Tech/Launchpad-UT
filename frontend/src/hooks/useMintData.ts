import {useEffect, useState} from 'react'
import {useCollectionsStore} from '../stores/collectionsStore'
import {getMockFactories} from '../data/collections.data'
import {getAssetUrl} from '../utils/imageHelper'
import {Collection} from '../types/collection.types'

export interface Factory {
  id: number
  name: string
  description: string
  mintPrice: string
  supply: number
  minted: number
  collectionName: string
}

export interface MintItem {
  id: number
  name: string
  image: string
  price: string
  timestamp: string
  minter: {
    address: string
    username: string
  }
  transactionHash: string
  tokenId: string
  rarity: string
}

export interface MintPhase {
  name: string
  active: boolean
  date: string
}

// Fonction pour construire les données de factory à partir des collections
const buildFactoryFromCollections = (
  factoryId: string, 
  collectionId: string, 
  allCollections: Collection[]
): Factory | null => {
  const numericCollectionId = parseInt(collectionId)
  const numericFactoryId = parseInt(factoryId)
  
  // Chercher la collection dans les données existantes
  const collection = allCollections.find(col => col.attributes.id === numericCollectionId)
  
  if (collection) {
    // Récupérer les factories mock pour cette collection
    const factories = getMockFactories(numericCollectionId)
    const factory = factories.find(f => f.id === numericFactoryId)
    
    if (factory) {
      return {
        id: factory.id,
        name: factory.name,
        description: factory.description,
        mintPrice: factory.mintPrice,
        supply: factory.supply,
        minted: factory.minted,
        collectionName: collection.attributes.name,
      }
    }
  }
  
  // Fallback vers les données hardcodées si pas trouvé
  const factoryNames: Record<string, string> = {
    '1': 'Dark Wisdom Counsellor',
    '2': 'Phygital Voucher',
  }

  const collectionNames: Record<string, string> = {
    '1': 'Ultra Street-Cubism',
    '2': 'Ultra Street-Cubism',
  }

  return {
    id: numericFactoryId,
    name: factoryNames[factoryId] || 'Dark Wisdom Counsellor',
    description: factoryId === '1' 
      ? 'A stunning Dark Street Cubism painting inspired by an Ultra\'s Movement Elder design. This exclusive creation is personally signed by C-la. By acquiring this Art, you\'re automatically entered into a special raffle that occurs every 5 UniQ purchases (excluding Vouchers), giving you a chance to win a high-rarity ViT UniQ from the UT Collection.'
      : 'Transform your digital Ultra Street-Cubism collection into a physical masterpiece. This voucher entitles you to receive a printed version of your UniQ on a premium 60cm x 80cm dibond support, ensuring durability and longevity. (Shipping costs not included) For more information, contact Ultra Times teams on Discord: https://discord.gg/R2zvShJAyh',
    mintPrice: '10.00000000 UOS',
    supply: 10,
    minted: 0,
    collectionName: collectionNames[collectionId] || 'Ultra Street-Cubism',
  }
}

// Fonction pour générer les items mintés mock
const generateMockMintedItems = (factoryId: string): MintItem[] => {
  return Array.from({length: 5}, (_, index) => ({
    id: index + 1,
    name: factoryId === '1' ? 'Dark Wisdom Counsellor' : 'Phygital Voucher',
    image: factoryId === '1' ? getAssetUrl('/banners/factory-1.png') : getAssetUrl('/banners/phygital.png'),
    price: '0 UOS',
    timestamp: `${index * 3 + 2} minutes ago`,
    minter: {
      address: `ultra${(10000 + index).toString().padStart(8, '0')}`,
      username: ['CryptoWhale', 'NFTHunter', 'PixelMaster', 'ArtCollector', 'CryptoArtist'][index],
    },
    transactionHash: `e632c1912a0edea37aef901749${index}c2554fe8a37f011ac9424b4f3cae124049b3`,
    tokenId: `#${1234 + index}`,
    rarity: 'Legendary',
  }))
}

export function useMintData(factoryId: string, collectionId: string) {
  const {allCollections, _hasHydrated} = useCollectionsStore()
  
  const [factory, setFactory] = useState<Factory | null>(null)
  const [mintedItems, setMintedItems] = useState<MintItem[]>([])
  const [phases, setPhases] = useState<MintPhase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMintData = () => {
      if (!_hasHydrated || !factoryId || !collectionId) return

      // 1. Essayer de construire les données à partir des collections existantes
      if (allCollections.length > 0) {
        const builtFactory = buildFactoryFromCollections(factoryId, collectionId, allCollections)
        
        if (builtFactory) {
          setFactory(builtFactory)
          setPhases([{name: 'Public Mint', active: true, date: 'Available now'}])
          setMintedItems(generateMockMintedItems(factoryId))
          setLoading(false)
          

          return
        }
      }

      // 2. Fallback vers les données hardcodées avec un délai minimal
      setTimeout(() => {
        const fallbackFactory = buildFactoryFromCollections(factoryId, collectionId, [])
        
        if (fallbackFactory) {
          setFactory(fallbackFactory)
          setPhases([{name: 'Public Mint', active: true, date: 'Available now'}])
          setMintedItems(generateMockMintedItems(factoryId))
        }
        
        setLoading(false)

      }, 100) // Délai minimal au lieu de 800ms
    }

    loadMintData()
  }, [factoryId, collectionId, allCollections, _hasHydrated])

  // Fonction pour mettre à jour le factory après un mint
  const updateFactoryAfterMint = (mintAmount: number, newMints: MintItem[]) => {
    if (factory) {
      setFactory({
        ...factory,
        minted: factory.minted + mintAmount
      })
      setMintedItems([...newMints, ...mintedItems])
    }
  }

  return {
    factory,
    mintedItems,
    phases,
    loading,
    updateFactoryAfterMint,
    setMintedItems, // Pour compatibilité avec l'implémentation existante
  }
} 