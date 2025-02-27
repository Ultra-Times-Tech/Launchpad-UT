import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  isUltraWalletAvailable, 
  getUltraSession, 
  getUltraAccount, 
  connectUltraWallet, 
  disconnectUltraWallet 
} from '../utils/walletHelper';
import { getAssetUrl } from '../utils/imageHelper';

interface WalletContextType {
  isAvailable: boolean;
  isConnected: boolean;
  account: unknown | null;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  isAvailable: false,
  isConnected: false,
  account: null,
  connect: async () => false,
  disconnect: async () => false,
  error: null
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [account, setAccount] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check wallet availability and connection status on mount
  useEffect(() => {
    const checkWalletStatus = async () => {
      const available = isUltraWalletAvailable();
      setIsAvailable(available);

      if (available) {
        try {
          const session = await getUltraSession();
          if (session) {
            const account = await getUltraAccount();
            setIsConnected(true);
            setAccount(account);
          }
        } catch (err) {
          console.error('Error checking wallet status:', err);
          setError('Failed to check wallet status');
        }
      }
    };

    checkWalletStatus();
  }, []);

  // Connect to the Ultra wallet
  const connect = async (): Promise<boolean> => {
    setError(null);
    
    if (!isAvailable) {
      setError('Ultra wallet is not available');
      return false;
    }

    try {
      const account = await connectUltraWallet(
        'Launchpad Ultra Times',
        'NFT Launchpad for Ultra Times',
        getAssetUrl('/logos/logo-ut.png')
      );
      
      if (account) {
        setIsConnected(true);
        setAccount(account);
        return true;
      }
      
      return false;
    } catch (err: unknown) {
      console.error('Error connecting to wallet:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to connect to wallet');
      } else {
        setError('Failed to connect to wallet');
      }
      return false;
    }
  };

  // Disconnect from the Ultra wallet
  const disconnect = async (): Promise<boolean> => {
    setError(null);
    
    if (!isAvailable) {
      return false;
    }

    try {
      const success = await disconnectUltraWallet();
      
      if (success) {
        setIsConnected(false);
        setAccount(null);
      }
      
      return success;
    } catch (err: unknown) {
      console.error('Error disconnecting from wallet:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to disconnect from wallet');
      } else {
        setError('Failed to disconnect from wallet');
      }
      return false;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isAvailable,
        isConnected,
        account,
        connect,
        disconnect,
        error
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};