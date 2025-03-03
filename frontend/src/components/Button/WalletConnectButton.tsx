import {useState, useEffect, useRef} from 'react'
import {useUltraWallet} from '../../utils/ultraWalletHelper'

interface WalletConnectProps {
  onConnect?: (blockchainId: string) => void
  onDisconnect?: () => void
  className?: string
}

type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface Notification {
  id: string
  message: string
  type: NotificationType
  duration: number
}

const WalletConnectButton: React.FC<WalletConnectProps> = ({onConnect, onDisconnect, className = ''}) => {
  const {isInstalled, isConnected, isLoading, error, blockchainId, connect, disconnect} = useUltraWallet()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const notificationTimeouts = useRef<{[key: string]: NodeJS.Timeout}>({})
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null)
  const [lastConnectedId, setLastConnectedId] = useState<string | null>(null)

  // Call onConnect callback when connection is established
  useEffect(() => {
    if (isConnected && blockchainId && onConnect && blockchainId !== lastConnectedId) {
      onConnect(blockchainId)
      setLastConnectedId(blockchainId)
      showNotification('Wallet connected successfully!', 'success')
    }
  }, [isConnected, blockchainId, onConnect, lastConnectedId])

  // Show error notification when error occurs, but prevent duplicates
  useEffect(() => {
    if (error && error !== lastErrorMessage) {
      showNotification(error, 'error')
      setLastErrorMessage(error)
    }
  }, [error, lastErrorMessage])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(notificationTimeouts.current).forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  // Deduplicate notifications with the same message
  const showNotification = (message: string, type: NotificationType = 'info', duration: number = 5000) => {
    // Check if we already have this notification
    const existingNotification = notifications.find(n => n.message === message && n.type === type)
    if (existingNotification) {
      return // Don't add duplicate notifications
    }
    
    const id = Date.now().toString()
    const newNotification = {id, message, type, duration}
    
    setNotifications(prev => [...prev, newNotification])
    
    // Set timeout to remove notification
    notificationTimeouts.current[id] = setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id))
      delete notificationTimeouts.current[id]
      
      // If this was an error notification, clear the last error message
      if (type === 'error' && message === lastErrorMessage) {
        setLastErrorMessage(null)
      }
    }, duration)
  }

  const handleConnect = async () => {
    showNotification('Connecting to Ultra Wallet...', 'info', 10000)
    const success = await connect()
    
    if (!success) {
      if (onDisconnect) {
        onDisconnect()
      }
    }
  }

  const handleDisconnect = async () => {
    showNotification('Disconnecting from Ultra Wallet...', 'info', 10000)
    const success = await disconnect()
    
    if (success) {
      showNotification('Wallet disconnected successfully', 'success')
      setLastConnectedId(null)
      if (onDisconnect) {
        onDisconnect()
      }
    }
  }

  const getButtonStyles = () => {
    if (!isInstalled) {
      return 'bg-gray-600 text-white opacity-70 cursor-not-allowed'
    }
    
    if (isLoading) {
      return 'bg-gray-600 text-white cursor-wait'
    }
    
    if (isConnected) {
      return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg'
    }
    
    return 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg'
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={isConnected ? handleDisconnect : handleConnect}
        disabled={isLoading || !isInstalled}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${getButtonStyles()}`}
      >
        {!isInstalled && 'Ultra Wallet Not Installed'}
        {isInstalled && isLoading && 'Processing...'}
        {isInstalled && !isLoading && isConnected && (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
            <span>Wallet Connected</span>
          </div>
        )}
        {isInstalled && !isLoading && !isConnected && 'Connect Ultra Wallet'}
      </button>

      {/* Notification container */}
      <div className="absolute top-full mt-2 right-0 w-64 z-50">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`mb-2 p-3 rounded-lg shadow-lg text-sm font-medium animate-fadeIn relative overflow-hidden
              ${notification.type === 'success' ? 'bg-green-600 text-white' : ''}
              ${notification.type === 'error' ? 'bg-red-600 text-white' : ''}
              ${notification.type === 'warning' ? 'bg-yellow-500 text-white' : ''}
              ${notification.type === 'info' ? 'bg-primary-600 text-white' : ''}
            `}
          >
            <div className="flex items-start">
              {notification.type === 'success' && (
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'error' && (
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'warning' && (
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
              <div className="break-words">{notification.message}</div>
            </div>
            
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 w-full">
              <div 
                className="h-full bg-white"
                style={{
                  width: '100%',
                  animation: `shrink ${notification.duration}ms linear forwards`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WalletConnectButton