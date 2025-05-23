import {FilterCategory} from '../components/FilterBar/FilterBar'

export interface Collection {
  type: string
  id: string
  attributes: {
    id: number
    name: string
    content: string
    state: number
    publish_up: string | null
    publish_down: string | null
    modified: string
    image: string | null
    is_trending: boolean | null
    is_featured: boolean | null
    ordering: number | null
  }
}

export interface CollectionResponse {
  links: {
    self: string
  }
  data: Collection[] | Collection
  meta?: {
    'total-pages': number
  }
}

export interface FeaturedCollectionCardProps {
  id: number
  name: string
  description: string
  image: string
  artist: string
  date: string
  totalItems: number
  floorPrice: string
  comingSoon: boolean
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
  category: string
}

export interface CollectionCardProps {
  id: number
  name: string
  description: string
  image: string
  artist: string
  totalItems: number
  floorPrice: string
  category: FilterCategory | string
}

export interface MintActivity {
  id: number
  collectionName: string
  itemName: string
  price: string
  timestamp: string
  image: string
}

export interface CollectionDetailsProps {
  id: number
  name: string
  description: string
  image: string
  totalItems: number
  floorPrice: string
  creator: string
  releaseDate: string
  factories: FactoryCardProps[]
  features: string[]
}

export interface FactoryCardProps {
  id: number
  collectionId: number
  name: string
  description: string
  image: string
  mintPrice: string
  supply: number
  minted: number
}

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