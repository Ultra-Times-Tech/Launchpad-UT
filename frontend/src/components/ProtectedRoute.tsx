import {Navigate, Outlet} from 'react-router-dom'
import {useUltraWallet} from '../utils/ultraWalletHelper'
import {useEffect, useState} from 'react'
import useAlerts from '../hooks/useAlert'

function ProtectedRoute() {
  const {blockchainId, isConnected, isLoading, connect} = useUltraWallet()
  const {error: showError} = useAlerts()
  const [isChecking, setIsChecking] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 5

  useEffect(() => {
    const attemptSilentConnection = async () => {
      try {
        if (isConnected && blockchainId) {
          setIsChecking(false)
          return
        }

        const connected = await connect({onlyIfTrusted: true})

        if (connected || retryCount >= MAX_RETRIES) {
          setIsChecking(false)
        } else {
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 800)
        }
      } catch {
        setIsChecking(false)
      }
    }

    if (!isLoading) {
      attemptSilentConnection()
    }
  }, [isLoading, connect, isConnected, blockchainId, retryCount])

  if (isChecking || isLoading) {
    return (
      <div className='min-h-screen bg-dark-950 flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4'></div>
          <p className='text-primary-300'>Vérification de la connexion au portefeuille...</p>
        </div>
      </div>
    )
  }

  if (!isConnected || !blockchainId) {
    showError('Vous devez connecter votre wallet pour accéder à cette page')
    return <Navigate to='/' replace />
  }

  return <Outlet />
}

export default ProtectedRoute