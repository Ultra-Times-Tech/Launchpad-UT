/**
 * Utility functions for interacting with the Ultra wallet
 */

// Check if Ultra wallet is available in the browser
export const isUltraWalletAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.ultra;
};

// Get the current Ultra wallet session if it exists
export const getUltraSession = async (): Promise<any | null> => {
  if (!isUltraWalletAvailable()) {
    return null;
  }
  
  try {
    return await window.ultra.sessions.getSession();
  } catch (error) {
    console.error('Error getting Ultra session:', error);
    return null;
  }
};

// Get the current Ultra wallet account if connected
export const getUltraAccount = async (): Promise<any | null> => {
  if (!isUltraWalletAvailable()) {
    return null;
  }
  
  try {
    const session = await getUltraSession();
    if (!session) {
      return null;
    }
    
    return await window.ultra.accounts.getAccount();
  } catch (error) {
    console.error('Error getting Ultra account:', error);
    return null;
  }
};

// Connect to the Ultra wallet
export const connectUltraWallet = async (appName: string, appDescription?: string, appIcon?: string): Promise<any | null> => {
  if (!isUltraWalletAvailable()) {
    throw new Error('Ultra wallet is not available');
  }
  
  try {
    const session = await window.ultra.sessions.createSession({
      name: appName,
      description: appDescription,
      icon: appIcon
    });
    
    if (session) {
      return await window.ultra.accounts.getAccount();
    }
    
    return null;
  } catch (error) {
    console.error('Error connecting to Ultra wallet:', error);
    throw error;
  }
};

// Disconnect from the Ultra wallet
export const disconnectUltraWallet = async (): Promise<boolean> => {
  if (!isUltraWalletAvailable()) {
    return false;
  }
  
  try {
    await window.ultra.sessions.removeSession();
    return true;
  } catch (error) {
    console.error('Error disconnecting from Ultra wallet:', error);
    return false;
  }
};