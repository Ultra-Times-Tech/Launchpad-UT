import {useState, useEffect, useCallback} from 'react'

// Define types for Ultra Wallet responses
export interface UltraWalletConnectionData {
  blockchainid: string
  publicKey: string
}

export interface UltraWalletResponse<T> {
  status: string
  data: T
}

export interface UltraWalletError {
  status: string
  message: string
  code?: number
}

export interface UltraWalletTransactionResponse {
  transactionHash: string
}

export interface UltraWalletSignMessageResponse {
  signature: string
}

export interface UltraWalletChainIdResponse {
  chainId: string
}

export interface UltraWalletPurchaseItem {
  productId: number
  artifactId: number
  blockchainTransactionId: string
}

export interface UltraWalletPurchaseResponse {
  orderHash: string
  items: UltraWalletPurchaseItem[]
}

export interface UltraWalletConnectOptions {
  onlyIfTrusted?: boolean
  referralCode?: string
}

export interface UltraWalletSignOptions {
  signOnly?: boolean
}

export interface TransactionObject {
  action: string
  contract: string
  data: Record<string, unknown>
}

// Define the Ultra Wallet interface
interface UltraWallet {
  connect(options?: UltraWalletConnectOptions): Promise<UltraWalletResponse<UltraWalletConnectionData>>
  disconnect(): Promise<void>
  getChainId(): Promise<UltraWalletResponse<string>>
  signTransaction(txObject: TransactionObject | TransactionObject[], options?: UltraWalletSignOptions): Promise<UltraWalletResponse<UltraWalletTransactionResponse>>
  signMessage(message: string): Promise<UltraWalletResponse<UltraWalletSignMessageResponse>>
  purchaseItem(itemType: string, itemId: string): Promise<UltraWalletResponse<UltraWalletPurchaseResponse>>
  on(eventName: string, callback: (...args: unknown[]) => void): void
  off(eventName: string, callback: (...args: unknown[]) => void): void
  once(eventName: string, callback: (...args: unknown[]) => void): void
  prependListener(eventName: string, callback: (...args: unknown[]) => void): void
  prependOnceListener(eventName: string, callback: (...args: unknown[]) => void): void
  addListener(eventName: string, callback: (...args: unknown[]) => void): void
  removeListener(eventName: string, callback: (...args: unknown[]) => void): void
}

// Extend Window interface to include Ultra Wallet
declare global {
  interface Window {
    ultra?: UltraWallet
  }
}

/**
 * Check if Ultra Wallet is installed
 * @returns boolean indicating if Ultra Wallet is installed
 */
export const isUltraWalletInstalled = (): boolean => {
  return typeof window !== 'undefined' && 'ultra' in window
}

/**
 * Hook to detect Ultra Wallet installation
 * @returns boolean indicating if Ultra Wallet is installed
 */
export const useUltraWalletDetection = (): boolean => {
  const [isInstalled, setIsInstalled] = useState<boolean>(false)

  useEffect(() => {
    const checkWallet = () => {
      setIsInstalled(isUltraWalletInstalled())
    }

    // Check immediately
    checkWallet()

    // Also check after window is fully loaded
    if (document.readyState !== 'complete') {
      window.addEventListener('load', checkWallet)
      return () => window.removeEventListener('load', checkWallet)
    }
  }, [])

  return isInstalled
}

/**
 * Hook to manage Ultra Wallet connection
 * @returns Object with wallet connection state and methods
 */
export const useUltraWallet = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [blockchainId, setBlockchainId] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasAttemptedEagerConnect, setHasAttemptedEagerConnect] = useState<boolean>(false)

  const isInstalled = useUltraWalletDetection()

  // Handle wallet connection
  const connect = useCallback(
    async (options?: UltraWalletConnectOptions): Promise<boolean> => {
      if (!isInstalled || !window.ultra) {
        setError('Ultra Wallet is not installed')
        return false
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await window.ultra.connect(options)
        setBlockchainId(response.data.blockchainid)
        setPublicKey(response.data.publicKey)
        setIsConnected(true)

        // Get chain ID after successful connection
        try {
          const chainResponse = await window.ultra.getChainId()
          setChainId(chainResponse.data)
        } catch (chainErr) {
          console.error('Failed to get chain ID:', chainErr)
        }

        return true
      } catch (err) {
        const ultraErr = err as UltraWalletError
        setError(ultraErr.message || 'Failed to connect to Ultra Wallet')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [isInstalled]
  )

  // Handle eager connection (connect without user prompt if already trusted)
  const eagerConnect = useCallback(async (): Promise<boolean> => {
    if (hasAttemptedEagerConnect) return false
    setHasAttemptedEagerConnect(true)
    return connect({onlyIfTrusted: true})
  }, [connect, hasAttemptedEagerConnect])

  // Handle wallet disconnection
  const disconnect = useCallback(async (): Promise<boolean> => {
    if (!isInstalled || !window.ultra || !isConnected) {
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      await window.ultra.disconnect()
      setIsConnected(false)
      setBlockchainId(null)
      setPublicKey(null)
      setChainId(null)
      return true
    } catch (err) {
      const ultraErr = err as UltraWalletError
      setError(ultraErr.message || 'Failed to disconnect from Ultra Wallet')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [isInstalled, isConnected])

  // Sign a transaction
  const signTransaction = useCallback(
    async (txObject: TransactionObject | TransactionObject[], options?: UltraWalletSignOptions): Promise<UltraWalletResponse<UltraWalletTransactionResponse> | null> => {
      if (!isInstalled || !window.ultra || !isConnected) {
        setError('Wallet not connected')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await window.ultra.signTransaction(txObject, options)
        return response
      } catch (err) {
        const ultraErr = err as UltraWalletError
        setError(ultraErr.message || 'Transaction signing failed')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isInstalled, isConnected]
  )

  // Sign a message
  const signMessage = useCallback(
    async (message: string): Promise<UltraWalletResponse<UltraWalletSignMessageResponse> | null> => {
      if (!isInstalled || !window.ultra || !isConnected) {
        setError('Wallet not connected')
        return null
      }

      // Ensure message has a proper prefix
      const formattedMessage = message.startsWith('0x') || message.startsWith('UOSx') || message.startsWith('message:') ? message : `message:${message}`

      setIsLoading(true)
      setError(null)

      try {
        const response = await window.ultra.signMessage(formattedMessage)
        return response
      } catch (err) {
        const ultraErr = err as UltraWalletError
        setError(ultraErr.message || 'Message signing failed')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isInstalled, isConnected]
  )

  // Purchase an item (Uniq Factory)
  const purchaseItem = useCallback(
    async (itemType: string, itemId: string): Promise<UltraWalletResponse<UltraWalletPurchaseResponse> | null> => {
      if (!isInstalled || !window.ultra || !isConnected) {
        setError('Wallet not connected')
        return null
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await window.ultra.purchaseItem(itemType, itemId)
        return response
      } catch (err) {
        const ultraErr = err as UltraWalletError
        setError(ultraErr.message || 'Purchase failed')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [isInstalled, isConnected]
  )

  // Set up disconnect event listener
  useEffect(() => {
    if (isInstalled && window.ultra?.on && isConnected) {
      const handleDisconnect = () => {
        setIsConnected(false)
        setBlockchainId(null)
        setPublicKey(null)
        setChainId(null)
      }

      window.ultra.on('disconnect', handleDisconnect)

      return () => {
        window.ultra?.off('disconnect', handleDisconnect)
      }
    }
  }, [isInstalled, isConnected])

  // Try eager connection on initial load - but only once
  useEffect(() => {
    if (isInstalled && !isConnected && !hasAttemptedEagerConnect) {
      eagerConnect().catch(console.error)
    }
  }, [isInstalled, isConnected, eagerConnect, hasAttemptedEagerConnect])

  return {
    isInstalled,
    isConnected,
    isLoading,
    error,
    blockchainId,
    publicKey,
    chainId,
    connect,
    eagerConnect,
    disconnect,
    signTransaction,
    signMessage,
    purchaseItem,
  }
}

// Helper function to create a token transfer transaction
export const createTransferTransaction = (from: string, to: string, quantity: string, memo: string = ''): TransactionObject => {
  return {
    action: 'transfer',
    contract: 'eosio.token',
    data: {
      from,
      to,
      quantity,
      memo,
    },
  }
}

// Helper function to create a Uniq purchase transaction
export const createUniqPurchaseTransaction = (tokenId: number, buyer: string, receiver: string, maxPrice: string, memo: string = '', promoterId: string | null = null): TransactionObject => {
  return {
    action: 'buy',
    contract: 'eosio.nft.ft',
    data: {
      buy: {
        token_id: tokenId,
        buyer,
        receiver,
        max_price: maxPrice,
        memo,
        promoter_id: promoterId,
      },
    },
  }
}

// Export a default object with all wallet utilities
const UltraWalletHelper = {
  isUltraWalletInstalled,
  useUltraWalletDetection,
  useUltraWallet,
  createTransferTransaction,
  createUniqPurchaseTransaction,
}

export default UltraWalletHelper
