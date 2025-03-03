import {useContext, useCallback, useRef} from 'react'
import {AlertContext, AlertType} from '../context/AlertContext'

// Default alert duration in milliseconds
const DEFAULT_DURATION = 3000

/**
 * Enhanced hook for using alerts throughout the application
 * Provides additional utility functions and ensures only one alert is shown at a time
 */
export const useAlerts = () => {
  const context = useContext(AlertContext)
  const timeoutRef = useRef<number | null>(null)

  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider')
  }

  /**
   * Show an alert, replacing any existing alert
   * @param message Alert message
   * @param type Alert type
   * @param duration Duration in milliseconds (defaults to 3 seconds)
   * @returns The ID of the created alert
   */
  const showAlert = useCallback(
    (message: string, type: AlertType = 'info', duration: number = DEFAULT_DURATION) => {
      // Clear any existing timeout
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // Create the alert
      const id = context.addAlert({message, type, duration})

      // Set up automatic removal after duration
      timeoutRef.current = window.setTimeout(() => {
        context.removeAlert(id)
        timeoutRef.current = null
      }, duration)

      return id
    },
    [context]
  )

  /**
   * Show a success alert
   */
  const success = useCallback(
    (message: string, duration: number = DEFAULT_DURATION) => {
      return showAlert(message, 'success', duration)
    },
    [showAlert]
  )

  /**
   * Show an error alert
   */
  const error = useCallback(
    (message: string, duration: number = DEFAULT_DURATION) => {
      return showAlert(message, 'error', duration)
    },
    [showAlert]
  )

  /**
   * Show an info alert
   */
  const info = useCallback(
    (message: string, duration: number = DEFAULT_DURATION) => {
      return showAlert(message, 'info', duration)
    },
    [showAlert]
  )

  /**
   * Show a warning alert
   */
  const warning = useCallback(
    (message: string, duration: number = DEFAULT_DURATION) => {
      return showAlert(message, 'warning', duration)
    },
    [showAlert]
  )

  /**
   * Remove an alert by ID
   */
  const removeAlert = useCallback(
    (id: string) => {
      context.removeAlert(id)
    },
    [context]
  )

  /**
   * Clear the current alert
   */
  const clearAlert = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    context.clearAlert()
  }, [context])

  return {
    alert: context.alert,
    showAlert,
    success,
    error,
    info,
    warning,
    removeAlert,
    clearAlert,
  }
}

export default useAlerts