import {useState, useEffect} from 'react'
import {apiRequestor} from '../utils/axiosInstanceHelper'
import {FeaturedCollectionCardProps} from '../components/Card/FeaturedCollectionCard'

export interface NFT {
  id: number
  name: string
  description: string
  price: string
  image: string
  artist: string
  supply: number
  minted: number
}

export interface MintActivity {
  id: number
  collectionName: string
  itemName: string
  price: string
  timestamp: string
  image: string
}

export interface FeaturedCollection {
  id: number
  name: string
  description: string
  image: string
  artist: string
}

export interface TrendingCollection {
  id: number
  name: string
  description: string
  image: string
  artist: string
  totalItems: number
  floorPrice: string
}

export function useCollections() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollectionCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from backend...')
        const nftResponse = await apiRequestor.get('/nfts')
        console.log('NFTs response:', nftResponse.data)
        setNfts(nftResponse.data)

        setFeaturedCollections([
          {
            id: 1,
            name: 'Vox-in-Time',
            description: 'Suspendisse pretium. Sed neque augue, mattis in posuere euis, sagittis...',
            image: '/banners/vit-banner.png',
            artist: 'Ultra Times',
            date: 'Mar 16, 2025',
            totalItems: 1000,
            floorPrice: '0.5 ETH',
            comingSoon: true,
          },
          {
            id: 2,
            name: 'Ultra Street-Cubism Discover',
            description: 'Nunc ex tortor, venenatis fermentum ipsum id, gravida lacinia cras...',
            image: '/banners/factory-artifact.png',
            artist: 'Bob Jacob',
            date: 'Feb 22, 2025',
            totalItems: 500,
            floorPrice: '0.8 ETH',
            comingSoon: false,
          },
          {
            id: 3,
            name: 'Crypto Punks Edition',
            description: 'Praesent lobortis, lorem id elementum vehicula, sapien ipsum tincidunt...',
            image: '/banners/factory-characters.png',
            artist: 'John Alvarez',
            date: 'Mar 10, 2025',
            totalItems: 750,
            floorPrice: '1.2 ETH',
            comingSoon: false,
          },
        ])

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
    featuredCollections,
    loading,
    error,
  }
}

export const latestCollections: FeaturedCollection[] = [
  {
    id: 1,
    name: 'Vox-in-Time',
    description: 'A groundbreaking collection featuring futuristic digital art and unique characters',
    image: 'https://picsum.photos/800/500?random=1',
    artist: 'Ultra Times Studios',
  },
  {
    id: 2,
    name: 'Ultra Street-Cubism',
    description: 'Where street art meets digital innovation in a stunning NFT collection',
    image: 'https://picsum.photos/800/500?random=2',
    artist: 'Digital Cubists',
  },
  {
    id: 3,
    name: 'Crypto Punks Edition',
    description: 'The legendary collection reimagined for the Ultra ecosystem',
    image: 'https://picsum.photos/800/500?random=3',
    artist: 'CryptoPunk Labs',
  },
  {
    id: 4,
    name: 'Factory Arsenal',
    description: 'Exclusive weapons and equipment from the future',
    image: 'https://picsum.photos/800/500?random=4',
    artist: 'Arsenal Studios',
  },
  {
    id: 5,
    name: 'Power Boosters',
    description: 'Enhance your digital experience with unique power-ups',
    image: 'https://picsum.photos/800/500?random=5',
    artist: 'Power Labs',
  },
]

export const mintActivities: MintActivity[] = [
  {
    id: 1,
    collectionName: 'Vox-in-Time',
    itemName: 'Character #156',
    price: '0.5 UOS',
    timestamp: '2 minutes ago',
    image: 'https://picsum.photos/100/100?random=6',
  },
  {
    id: 2,
    collectionName: 'Ultra Street-Cubism',
    itemName: 'Artwork #89',
    price: '0.8 UOS',
    timestamp: '5 minutes ago',
    image: 'https://picsum.photos/100/100?random=7',
  },
  {
    id: 3,
    collectionName: 'Crypto Punks',
    itemName: 'Punk #2234',
    price: '1.2 UOS',
    timestamp: '8 minutes ago',
    image: 'https://picsum.photos/100/100?random=8',
  },
  {
    id: 4,
    collectionName: 'Factory Arsenal',
    itemName: 'Weapon #445',
    price: '0.6 UOS',
    timestamp: '12 minutes ago',
    image: 'https://picsum.photos/100/100?random=9',
  },
  {
    id: 5,
    collectionName: 'Power Boosters',
    itemName: 'Booster #78',
    price: '0.3 UOS',
    timestamp: '15 minutes ago',
    image: 'https://picsum.photos/100/100?random=10',
  },
  {
    id: 6,
    collectionName: 'Digital Dreams',
    itemName: 'Dream #123',
    price: '0.7 UOS',
    timestamp: '18 minutes ago',
    image: 'https://picsum.photos/100/100?random=11',
  },
  {
    id: 7,
    collectionName: 'Cyber Warriors',
    itemName: 'Warrior #445',
    price: '0.9 UOS',
    timestamp: '20 minutes ago',
    image: 'https://picsum.photos/100/100?random=12',
  },
  {
    id: 8,
    collectionName: 'Nature Redux',
    itemName: 'Nature #67',
    price: '0.4 UOS',
    timestamp: '25 minutes ago',
    image: 'https://picsum.photos/100/100?random=13',
  },
  {
    id: 9,
    collectionName: 'Meta Beings',
    itemName: 'Being #890',
    price: '1.1 UOS',
    timestamp: '30 minutes ago',
    image: 'https://picsum.photos/100/100?random=14',
  },
  {
    id: 10,
    collectionName: 'Space Odyssey',
    itemName: 'Planet #234',
    price: '0.8 UOS',
    timestamp: '35 minutes ago',
    image: 'https://picsum.photos/100/100?random=15',
  },
]

export const trendingCollections: TrendingCollection[] = [
  {
    id: 1,
    name: 'Digital Dreams',
    description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem, carefully crafted for maximum impact.',
    image: 'https://picsum.photos/400/300?random=11',
    artist: 'Digital Dreamers',
    totalItems: 500,
    floorPrice: '0.4 ETH',
  },
  {
    id: 2,
    name: 'Cyber Warriors',
    description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem, carefully crafted for maximum impact.',
    image: 'https://picsum.photos/400/300?random=12',
    artist: 'Cyber Labs',
    totalItems: 750,
    floorPrice: '0.6 ETH',
  },
  {
    id: 3,
    name: 'Nature Redux',
    description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem, carefully crafted for maximum impact.',
    image: 'https://picsum.photos/400/300?random=13',
    artist: 'Green Digital',
    totalItems: 300,
    floorPrice: '0.3 ETH',
  },
  {
    id: 4,
    name: 'Meta Beings',
    description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem, carefully crafted for maximum impact.',
    image: 'https://picsum.photos/400/300?random=14',
    artist: 'Meta Creators',
    totalItems: 1000,
    floorPrice: '0.5 ETH',
  },
  {
    id: 5,
    name: 'Space Odyssey',
    description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem, carefully crafted for maximum impact.',
    image: 'https://picsum.photos/400/300?random=15',
    artist: 'Space Labs',
    totalItems: 600,
    floorPrice: '0.7 ETH',
  },
  {
    id: 6,
    name: 'Pixel Masters',
    description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem, carefully crafted for maximum impact.',
    image: 'https://picsum.photos/400/300?random=16',
    artist: 'Pixel Art Studio',
    totalItems: 800,
    floorPrice: '0.45 ETH',
  },
  {
    id: 7,
    name: 'Future Funk',
    description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem, carefully crafted for maximum impact.',
    image: 'https://picsum.photos/400/300?random=17',
    artist: 'Funk Factory',
    totalItems: 400,
    floorPrice: '0.55 ETH',
  },
  {
    id: 8,
    name: 'Crystal Kingdoms',
    description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem, carefully crafted for maximum impact.',
    image: 'https://picsum.photos/400/300?random=18',
    artist: 'Crystal Arts',
    totalItems: 550,
    floorPrice: '0.65 ETH',
  },
  {
    id: 9,
    name: 'Tech Totems',
    description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem, carefully crafted for maximum impact.',
    image: 'https://picsum.photos/400/300?random=19',
    artist: 'Digital Shamans',
    totalItems: 450,
    floorPrice: '0.48 ETH',
  },
  {
    id: 10,
    name: 'Ocean Protocol',
    description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem, carefully crafted for maximum impact.',
    image: 'https://picsum.photos/400/300?random=20',
    artist: 'Ocean Labs',
    totalItems: 700,
    floorPrice: '0.58 ETH',
  },
]