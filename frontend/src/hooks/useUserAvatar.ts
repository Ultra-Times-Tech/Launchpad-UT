import { useState, useEffect } from 'react';
import { getUserAvatar, fetchUserNfts } from '../utils/nftService';

export interface UserAvatar {
  nftId: string | null;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useUserAvatar = (blockchainId: string | null): UserAvatar => {
  const [avatarData, setAvatarData] = useState<UserAvatar>({
    nftId: null,
    imageUrl: null,
    isLoading: false,
    error: null
  });

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!blockchainId) {
        return;
      }

      setAvatarData(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Étape 1: Récupérer l'ID du NFT d'avatar
        const avatarResponse = await getUserAvatar(blockchainId);
        const avatarNftId = avatarResponse?.nft_id || null;

        if (!avatarNftId) {
          setAvatarData({
            nftId: null,
            imageUrl: null,
            isLoading: false,
            error: null
          });
          return;
        }

        // Étape 2: Récupérer les détails du NFT pour obtenir l'URL de l'image
        const userNfts = await fetchUserNfts(blockchainId);
        const avatarNft = userNfts.find(nft => nft.id === avatarNftId);

        if (avatarNft) {
          const imageUrl = 
            avatarNft.metadata.content.medias.square?.uri || 
            avatarNft.metadata.content.medias.product?.uri || 
            avatarNft.metadata.content.medias.gallery?.uri ||
            avatarNft.metadata.content.medias.hero?.uri ||
            null;

          setAvatarData({
            nftId: avatarNftId,
            imageUrl,
            isLoading: false,
            error: null
          });
        } else {
          setAvatarData({
            nftId: avatarNftId,
            imageUrl: null,
            isLoading: false,
            error: "NFT introuvable"
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'avatar:", error);
        setAvatarData({
          nftId: null,
          imageUrl: null,
          isLoading: false,
          error: error instanceof Error ? error.message : "Erreur inconnue"
        });
      }
    };

    fetchAvatar();
  }, [blockchainId]);

  return avatarData;
}; 