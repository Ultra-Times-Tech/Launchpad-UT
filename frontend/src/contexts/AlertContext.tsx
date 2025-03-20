import { createContext } from 'react'

// Alert Types and Interfaces
export type AlertType = 'success' | 'error' | 'info' | 'warning'

export interface Alert {
  id: string
  message: string
  type: AlertType
  duration: number
}

interface AlertContextType {
  alert: Alert | null
  addAlert: (alert: Omit<Alert, 'id'>) => string
  removeAlert: (id: string) => void
  clearAlert: () => void
}

// Create Context with a default value
export const AlertContext = createContext<AlertContextType>({
  alert: null,
  addAlert: () => '',
  removeAlert: () => {},
  clearAlert: () => {},
})