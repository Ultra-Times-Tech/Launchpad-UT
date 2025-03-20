import React, {useEffect} from 'react'
import {AlertType} from '../../contexts/AlertContext'
import useAlerts from '../../hooks/useAlert'

// Individual Alert Component
interface AlertProps {
  id: string
  message: string
  type: AlertType
  duration: number
  onClose: (id: string) => void
}

const AlertComponent: React.FC<AlertProps> = ({id, message, type, duration, onClose}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white'
      case 'error':
        return 'bg-red-600 text-white'
      case 'warning':
        return 'bg-yellow-500 text-white'
      case 'info':
        return 'bg-primary-600 text-white'
      default:
        return 'bg-primary-600 text-white'
    }
  }

  const getAlertIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className='w-4 h-4 mr-2 mt-0.5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
          </svg>
        )
      case 'error':
        return (
          <svg className='w-4 h-4 mr-2 mt-0.5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
          </svg>
        )
      case 'warning':
        return (
          <svg className='w-4 h-4 mr-2 mt-0.5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
          </svg>
        )
      case 'info':
        return (
          <svg className='w-4 h-4 mr-2 mt-0.5 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className={`mb-2 p-3 rounded-lg shadow-lg text-sm font-medium animate-fadeIn relative overflow-hidden ${getAlertStyles()}`}>
      <div className='flex items-start'>
        {getAlertIcon()}
        <div className='break-words'>{message}</div>
      </div>

      {/* Progress bar */}
      <div className='absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 w-full'>
        <div
          className='h-full bg-white'
          style={{
            width: '100%',
            animation: `shrink ${duration}ms linear forwards`,
          }}></div>
      </div>
    </div>
  )
}

// Alert Container Component
interface AlertContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  className?: string
}

export const AlertContainer: React.FC<AlertContainerProps> = ({position = 'top-right', className = ''}) => {
  const {alert, removeAlert} = useAlerts()

  if (!alert) {
    return null
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-20 right-1.5'
      case 'top-left':
        return 'top-20 left-1'
      case 'bottom-right':
        return 'bottom-4 right-1.5'
      case 'bottom-left':
        return 'bottom-4 left-1.5'
      case 'top-center':
        return 'top-20 left-1/2 transform -translate-x-1/2'
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2'
      default:
        return 'top-20 right-1.5'
    }
  }

  return (
    <div className={`fixed z-50 w-72 ${getPositionClasses()} ${className}`}>
      <AlertComponent key={alert.id} id={alert.id} message={alert.message} type={alert.type} duration={alert.duration} onClose={removeAlert} />
    </div>
  )
}

export default AlertComponent