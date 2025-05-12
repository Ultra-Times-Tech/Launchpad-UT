export interface CollectionAttributes {
  id: number
  name: string
  description: string
  note?: string | null
  state: number
  publish_up: string | null
  publish_down: string | null
  created: string | null
  created_by: number
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