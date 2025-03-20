import { useState, useCallback, ReactNode } from 'react'
import { AlertContext, Alert } from '../contexts/AlertContext'

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