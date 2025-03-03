import { useState, useCallback, createContext, ReactNode } from 'react'

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

// Alert Provider Component
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<Alert | null>(null)

  const addAlert = useCallback((alertData: Omit<Alert, 'id'>) => {
    const id = Date.now().toString()
    const newAlert = { ...alertData, id }
    
    // Replace any existing alert with the new one
    setAlert(newAlert)
    return id
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlert(currentAlert => currentAlert?.id === id ? null : currentAlert)
  }, [])

  const clearAlert = useCallback(() => {
    setAlert(null)
  }, [])

  return (
    <AlertContext.Provider value={{ alert, addAlert, removeAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  )
}

export default AlertProvider