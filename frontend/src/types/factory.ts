export interface Currency {
  code: string
  symbol: string
}

export interface Price {
  amount: string
  currency: Currency
}

export interface Media {
  uri: string
}

export interface Medias {
  square: Media
}

export interface MetadataContent {
  name: string
  description: string
  medias: Medias
}

export interface Metadata {
  content: MetadataContent
}

export interface FirsthandPurchase {
  price: Price
}

export interface Stock {
  authorized: number
  existing: number
  maxMintable: number
  mintable: number
  minted: number
}

export interface Factory {
  id: string
  metadata: Metadata
  firsthandPurchases: FirsthandPurchase[]
  stock: Stock
  status: string
  type: string
}

export interface FactoryResponse {
  uniqFactory: Factory
}

export interface FactoryVars {
  id: string
}