import {useState, useEffect} from 'react'
import {useUltraWallet} from '../../utils/ultraWalletHelper'

interface WalletConnectProps {
  onConnect?: (blockchainId: string) => void
  onDisconnect?: () => void
  className?: string
}

const WalletConnectButton: React.FC<WalletConnectProps> = ({onConnect, onDisconnect, className = ''}) => {
  const {isInstalled, isConnected, isLoading, error, blockchainId, connect, disconnect} = useUltraWallet()

  const [showError, setShowError] = useState<boolean>(false)

  // Call onConnect callback when connection is established
  useEffect(() => {
    if (isConnected && blockchainId && onConnect) {
      onConnect(blockchainId)
    }
  }, [isConnected, blockchainId, onConnect])

  // Show error message for 5 seconds
  useEffect(() => {
    if (error) {
      setShowError(true)
      const timer = setTimeout(() => {
        setShowError(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error])

  const handleConnect = async () => {
    const success = await connect()
    if (!success && onDisconnect) {
      onDisconnect()
    }
  }

  const handleDisconnect = async () => {
    const success = await disconnect()
    if (success && onDisconnect) {
      onDisconnect()
    }
  }

  if (!isInstalled) {
    return (
      <div className={`flex flex-col ${className}`}>
        <button className='px-4 py-2 bg-gray-600 text-white rounded-lg opacity-70 cursor-not-allowed' disabled>
          Ultra Wallet Not Installed
        </button>
        {showError && error && <div className='mt-2 text-red-500 text-sm'>{error}</div>}
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {isConnected ? (
        <button
          onClick={handleDisconnect}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors
            ${isLoading ? 'bg-gray-600 text-white cursor-wait' : 'bg-green-600 text-white hover:bg-green-700'}`}>
          {isLoading ? 'Processing...' : 'Wallet Connected'}
        </button>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors
            ${isLoading ? 'bg-gray-600 text-white cursor-wait' : 'bg-primary-500 text-white hover:bg-primary-600'}`}>
          {isLoading ? 'Connecting...' : 'Connect Ultra Wallet'}
        </button>
      )}

      {showError && error && <div className='mt-2 text-red-500 text-sm'>{error}</div>}
    </div>
  )
}

export default WalletConnectButton