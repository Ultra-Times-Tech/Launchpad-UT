export interface CollectionAttributes {
  id: number
  name: string
  state: number
  publish_up: string | null
  publish_down: string | null
  modified: string
  image: string | null
  is_trending: boolean | null
  is_featured: boolean | null
  ordering: number | null
}

export interface Collection {
  type: string
  id: string
  attributes: CollectionAttributes
} 