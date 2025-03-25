export interface CollectionAttributes {
  id: number
  name: string
  state: number
  publish_up: string | null
  publish_down: string | null
  created: string
  modified: string
}

export interface Collection {
  type: string
  id: string
  attributes: CollectionAttributes
} 