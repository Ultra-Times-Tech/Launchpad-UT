import { useState, useEffect, useRef } from 'react';
import { getUserAvatar } from '../utils/uniqService';

// Définition de l'événement customisé pour les mises à jour d'avatar
export const AVATAR_UPDATE_EVENT = 'avatar_update_event';

// Type pour les données d'avatar en cache
interface AvatarCacheData {
  imageUrl: string | null;
  nftId: string | null;
  timestamp: number;
}

// Cache global pour les avatars par blockchainId
const avatarCache: Record<string, AvatarCacheData> = {};

// Fonction pour rafraîchir l'avatar d'un utilisateur
export const refreshUserAvatar = (
  blockchainId: string | null, 
  forceUpdate: boolean = false,
  nftData?: { nftId: string | null, imageUrl: string | null }
) => {
  if (!blockchainId) return;
  
  // Si des données sont fournies, mettre immédiatement à jour le cache
  if (nftData) {
    avatarCache[blockchainId] = {
      imageUrl: nftData.imageUrl,
      nftId: nftData.nftId,
      timestamp: Date.now()
    };
  }
  
  // Déclencher un événement pour informer tous les composants de la mise à jour
  const event = new CustomEvent(AVATAR_UPDATE_EVENT, { 
    detail: { 
      blockchainId, 
      forceUpdate,
      nftData
    } 
  });
  
  window.dispatchEvent(event);
};

// Fonction pour vider le cache d'avatar
export const clearAvatarCache = (blockchainId?: string) => {
  if (blockchainId) {
    delete avatarCache[blockchainId];
  } else {
    // Vider tout le cache
    Object.keys(avatarCache).forEach(key => {
      delete avatarCache[key];
    });
  }
};

const useUserAvatar = (blockchainId: string | null) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [avatarNftId, setAvatarNftId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const lastFetchedAt = useRef<number>(0);
  
  const fetchAvatar = async (forceRefresh = false) => {
    if (!blockchainId) {
      setImageUrl(null);
      setAvatarNftId(null);
      return;
    }

    // Vérifier si nous avons des données en cache récentes (moins de 1 minute)
    const cachedData = avatarCache[blockchainId];
    const now = Date.now();
    
    // Si nous avons des données en cache récentes et qu'on ne force pas le rafraîchissement
    if (!forceRefresh && cachedData && (now - cachedData.timestamp < 60000)) {
      setImageUrl(cachedData.imageUrl);
      setAvatarNftId(cachedData.nftId);
      return;
    }

    // Si la dernière requête a été faite il y a moins de 2 secondes, ignorer
    if (!forceRefresh && now - lastFetchedAt.current < 2000) {
      return;
    }

    setIsLoading(true);
    lastFetchedAt.current = now;

    try {
      const avatarData = await getUserAvatar(blockchainId);
      
      // Mettre à jour le cache
      avatarCache[blockchainId] = {
        imageUrl: avatarData.imageUrl,
        nftId: avatarData.nftId,
        timestamp: now
      };
      
      setImageUrl(avatarData.imageUrl);
      setAvatarNftId(avatarData.nftId);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching user avatar:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour localement l'avatar sans attendre la blockchain
  const updateLocalAvatar = (nftId: string | null, newImageUrl: string | null = null) => {
    if (!blockchainId) return;
    
    // Mettre à jour le state local immédiatement
    setAvatarNftId(nftId);
    
    if (newImageUrl !== null) {
      setImageUrl(newImageUrl);
    }
    
    // Utiliser la fonction globale pour mettre à jour le cache et informer les autres composants
    refreshUserAvatar(blockchainId, false, {
      nftId: nftId,
      imageUrl: newImageUrl
    });
  };

  // Effet pour charger l'avatar au montage et quand blockchainId change
  useEffect(() => {
    fetchAvatar();
  }, [blockchainId]);

  // Effet pour écouter les événements de mise à jour d'avatar
  useEffect(() => {
    const handleAvatarUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{
        blockchainId: string;
        forceUpdate: boolean;
        nftData?: { nftId: string | null, imageUrl: string | null };
      }>;
      
      // Vérifier si cet événement concerne notre blockchainId
      if (blockchainId && customEvent.detail.blockchainId === blockchainId) {
        // Si des données sont fournies, mettre à jour immédiatement
        if (customEvent.detail.nftData) {
          setAvatarNftId(customEvent.detail.nftData.nftId);
          if (customEvent.detail.nftData.imageUrl !== null) {
            setImageUrl(customEvent.detail.nftData.imageUrl);
          }
        } else {
          // Sinon, charger depuis l'API si forceUpdate est true
          if (customEvent.detail.forceUpdate) {
            fetchAvatar(true);
          }
        }
      }
    };

    window.addEventListener(AVATAR_UPDATE_EVENT, handleAvatarUpdate);
    
    return () => {
      window.removeEventListener(AVATAR_UPDATE_EVENT, handleAvatarUpdate);
    };
  }, [blockchainId]);

  return {
    imageUrl,
    avatarNftId,
    isLoading,
    error,
    refreshAvatar: () => fetchAvatar(true),
    updateLocalAvatar
  };
};

export default useUserAvatar; 