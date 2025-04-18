export interface UserResponse {
  links: {
    self: string
  }
  data: any
  meta?: any
}

export interface UsersResponse {
  links: {
    self: string
  }
  data: any[]
  meta?: {
    'total-pages': number
  }
} 