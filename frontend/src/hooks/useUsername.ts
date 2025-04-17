import { useState, useEffect } from 'react';
import { apiRequestor } from '../utils/axiosInstanceHelper';
import { cleanWalletId } from '../utils/ultraWalletHelper';

export const useUsername = (blockchainId: string | null): { 
  username: string | null; 
  isLoading: boolean; 
  error: string | null 
} => {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!blockchainId) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const cleanedBlockchainId = cleanWalletId(blockchainId);
        const response = await apiRequestor.get(`/users/${cleanedBlockchainId}/username`);
        
        if (response.data && response.data.username) {
          setUsername(response.data.username);
        } else {
          setUsername(null);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du nom d'utilisateur:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setUsername(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsername();
  }, [blockchainId]);

  return { username, isLoading, error };
}; 