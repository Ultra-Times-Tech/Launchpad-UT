export interface WalletRow {
  field2: string
}

export interface Wallets {
  [key: string]: WalletRow
}

export interface UserAttributes {
  id: number
  name: string
  username: string
  email: string
  block: number
  sendEmail?: number
  registerDate: string
  lastvisitDate?: string | null
  lastResetTime?: string | null
  resetCount?: number
  group_count?: number
  group_names?: string
  tphone?: string
  'wallet-id'?: string
  wallets?: string | Wallets
  groups?: {
    [key: string]: number
  }
  requireReset?: number
  params?: {
    admin_language?: string
    admin_style?: string
    editor?: string
    helpsite?: string
    language?: string
    timezone?: string
  }
}

export interface User {
  type: string
  id: string
  attributes: UserAttributes
} 