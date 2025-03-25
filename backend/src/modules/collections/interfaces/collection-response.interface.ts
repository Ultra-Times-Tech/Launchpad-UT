import {Collection} from './collection.interface'

export interface CollectionsResponse {
  links: {
    self: string
  }
  data: Collection[] | Collection
  meta?: {
    'total-pages': number
  }
} 