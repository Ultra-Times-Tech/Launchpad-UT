import {useState, useEffect} from 'react'
import {useUltraWallet} from '../../utils/ultraWalletHelper'
import useAlerts from '../../hooks/useAlert'

interface WalletConnectProps {
  onConnect?: (blockchainId: string) => void
  onDisconnect?: () => void
  className?: string
}

const WalletConnectButton: React.FC<WalletConnectProps> = ({onConnect, onDisconnect, className = ''}) => {
  const {isInstalled, isConnected, isLoading, error, blockchainId, connect, disconnect} = useUltraWallet()
  const {success, error: showError, info} = useAlerts()
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null)
  const [lastConnectedId, setLastConnectedId] = useState<string | null>(null)

  // Call onConnect callback when connection is established
  useEffect(() => {
    if (isConnected && blockchainId && onConnect && blockchainId !== lastConnectedId) {
      onConnect(blockchainId)
      setLastConnectedId(blockchainId)
      success('Wallet connected successfully!')
    }
  }, [isConnected, blockchainId, onConnect, lastConnectedId, success])

  // Show error notification when error occurs, but prevent duplicates
  useEffect(() => {
    if (error && error !== lastErrorMessage) {
      showError(error)
      setLastErrorMessage(error)
    }
  }, [error, lastErrorMessage, showError])

  const handleConnect = async () => {
    info('Connecting to Ultra Wallet...', 10000)
    const isConnected = await connect()

    if (!isConnected) {
      if (onDisconnect) {
        onDisconnect()
      }
    }
  }

  const handleDisconnect = async () => {
    info('Disconnecting from Ultra Wallet...', 10000)
    const isDisconnected = await disconnect()

    if (isDisconnected) {
      success('Wallet disconnected successfully')
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
      <button onClick={isConnected ? handleDisconnect : handleConnect} disabled={isLoading || !isInstalled} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${getButtonStyles()}`}>
        {!isInstalled && 'Ultra Wallet Not Installed'}
        {isInstalled && isLoading && 'Processing...'}
        {isInstalled && !isLoading && isConnected && (
          <div className='flex items-center'>
            <div className='w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse'></div>
            <span>Wallet Connected</span>
          </div>
        )}
        {isInstalled && !isLoading && !isConnected && 'Connect Ultra Wallet'}
      </button>
    </div>
  )
}

export default WalletConnectButton
