import {FilterCategory} from '../components/FilterBar/FilterBar'
import {MintActivity, CollectionCardProps, CollectionDetailsProps, FactoryCardProps} from '../types/collection.types'

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

// Helper function to generate mock factories based on collection ID
export function getMockFactories(collectionId: number): FactoryCardProps[] {
  const factories: FactoryCardProps[] = []
  const factoryCount = 4
  
  for (let i = 1; i <= factoryCount; i++) {
    factories.push({
      id: i,
      collectionId,
      name: `Factory ${i}`,
      description: 'Create unique NFTs from this collection with various attributes and rarities.',
      image: `/banners/factory-${i % 2 + 1}.png`,
      mintPrice: '0.5 UOS',
      supply: 500,
      minted: Math.floor(Math.random() * 500),
    })
  }
  
  return factories
}

// Mock data function for fallback
export function getMockCollection(id: number): CollectionDetailsProps {
  const collections = [
    {
      id: 1,
      name: 'Vox-in-Time',
      description: 'A collection of rare weapons and equipment from the future, featuring unique designs and powerful capabilities.',
      image: '/banners/vit-banner.png',
      totalItems: 1000,
      floorPrice: '0.5 UOS',
      creator: 'Ultra Times Studios',
      releaseDate: 'March 15, 2025',
      features: ['Each weapon has unique attributes and power levels', 'Weapons can be used in the Ultra Times gaming ecosystem', 'Rare and legendary weapons include animated visual effects', 'Owners receive exclusive access to special in-game events', 'Limited edition weapons with enhanced capabilities', 'Blockchain-verified ownership and authenticity'],
      factories: [
        {
          id: 1,
          collectionId: 1,
          name: 'Weapon Factory Alpha',
          description: 'Create powerful weapons with various attributes and rarities.',
          image: '/banners/factory-1.png',
          mintPrice: '0.5 UOS',
          supply: 500,
          minted: 348,
        },
        {
          id: 2,
          collectionId: 1,
          name: 'Equipment Factory',
          description: 'Mint essential equipment for your virtual adventures.',
          image: '/banners/factory-2.png',
          mintPrice: '0.3 UOS',
          supply: 1000,
          minted: 756,
        },
        {
          id: 3,
          collectionId: 1,
          name: 'Special Edition Factory',
          description: 'Limited edition items with unique properties and enhanced capabilities.',
          image: '/banners/factory-1.png',
          mintPrice: '0.8 UOS',
          supply: 200,
          minted: 189,
        },
        {
          id: 4,
          collectionId: 1,
          name: 'Legendary Weapons',
          description: 'The rarest and most powerful weapons in the game.',
          image: '/banners/factory-2.png',
          mintPrice: '1.2 UOS',
          supply: 50,
          minted: 42,
        },
      ],
    },
    {
      id: 2,
      name: 'Ultra Street-Cubism',
      description: 'Enter the world of mysterious artifacts with this collection of rare and powerful items created by ancient civilizations.',
      image: '/banners/collection.png',
      totalItems: 500,
      floorPrice: '0.8 UOS',
      creator: 'Ultra Times Archaeology',
      releaseDate: 'February 22, 2025',
      features: ['Uniquely designed artifacts with distinct artistic styles', 'Each piece tells a story from ancient civilizations', 'Special visual effects based on rarity', 'Owners get access to exclusive galleries', 'Curated by renowned digital artists', 'Each piece is one-of-a-kind'],
      factories: [
        {
          id: 5,
          collectionId: 2,
          name: 'Artifact Factory',
          description: 'Create ancient artifacts with mysterious powers.',
          image: '/banners/factory-1.png',
          mintPrice: '0.8 UOS',
          supply: 300,
          minted: 243,
        },
        {
          id: 6,
          collectionId: 2,
          name: 'Cubist Art Mint',
          description: 'Generate unique art pieces influenced by cubism.',
          image: '/banners/factory-2.png',
          mintPrice: '0.6 UOS',
          supply: 400,
          minted: 289,
        },
        {
          id: 7,
          collectionId: 2,
          name: 'Ancient Relic Forge',
          description: 'Discover rare relics from forgotten civilizations.',
          image: '/banners/factory-1.png',
          mintPrice: '1.0 UOS',
          supply: 100,
          minted: 87,
        },
        {
          id: 8,
          collectionId: 2,
          name: 'Street Art Generator',
          description: 'Urban-inspired digital art with a modern twist.',
          image: '/banners/factory-2.png',
          mintPrice: '0.5 UOS',
          supply: 200,
          minted: 176,
        },
      ],
    },
  ]

  return collections.find(c => c.id === id) || collections[0]
}

// Helper function to generate mock collections
export function generateMockCollections(count: number): CollectionCardProps[] {
  const categories: FilterCategory[] = ['art', 'collectibles', 'game-assets', 'music', 'photography', 'sports']
  const baseCollections = [
    {
      id: 1,
      name: 'Vox-in-Time',
      description: 'A collection of rare weapons and equipment from the future, featuring unique designs and powerful capabilities.',
      image: '/banners/vit-banner.png',
      artist: 'Ultra Times Studios',
      totalItems: 1000,
      floorPrice: '0.5',
      category: 'game-assets' as FilterCategory,
    },
    {
      id: 2,
      name: 'Ultra Street-Cubism',
      description: 'Enter the world of mysterious artifacts with this collection of rare and powerful items created by ancient civilizations.',
      image: '/banners/collection.png',
      artist: 'Ultra Times Archaeology',
      totalItems: 500,
      floorPrice: '0.8',
      category: 'art' as FilterCategory,
    },
    {
      id: 3,
      name: 'Crypto Punks Edition',
      description: 'A collection featuring unique characters with different abilities, backgrounds, and stories from the Ultra Times universe.',
      image: '/banners/factory-characters.png',
      artist: 'Ultra Times Creative',
      totalItems: 750,
      floorPrice: '1.2',
      category: 'collectibles' as FilterCategory,
    },
    {
      id: 4,
      name: 'Factory Power Booster',
      description: 'Enhance your gameplay with these power boosters that provide special abilities and advantages in the Ultra Times ecosystem.',
      image: '/banners/factory-powerbooster.png',
      artist: 'Ultra Times Labs',
      totalItems: 600,
      floorPrice: '0.75',
      category: 'game-assets' as FilterCategory,
    },
  ]

  const collections: CollectionCardProps[] = []

  for (let i = 0; i < count; i++) {
    const baseCollection = baseCollections[i % baseCollections.length]
    collections.push({
      ...baseCollection,
      id: i + 1,
      name: i < baseCollections.length ? baseCollection.name : `${baseCollection.name} #${Math.floor(i / baseCollections.length) + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      floorPrice: (Math.random() * 15).toFixed(2),
    })
  }

  return collections
}

// Helper function to check if price is in range
export function isPriceInRange(price: string, range: string): boolean {
  const priceValue = parseFloat(price)
  switch (range) {
    case 'under-1':
      return priceValue < 1
    case '1-5':
      return priceValue >= 1 && priceValue <= 5
    case '5-10':
      return priceValue > 5 && priceValue <= 10
    case 'above-10':
      return priceValue > 10
    default:
      return true
  }
} 