import { apiRequestor } from './axiosInstanceHelper';
import { cleanWalletId } from './ultraWalletHelper';

const ULTRA_GRAPHQL_ENDPOINT = 'https://staging.api.ultra.io/graphql';

interface NftMedia {
  contentType: string;
  integrity?: {
    hash: string;
    type: string;
  };
  uri: string;
}

interface NftContent {
  name: string;
  description?: string;
  medias: {
    square?: NftMedia;
    gallery?: NftMedia;
    hero?: NftMedia;
    product?: NftMedia;
  };
}

interface NftMetadata {
  content: NftContent;
}

export interface Nft {
  id: string;
  metadata: NftMetadata;
  mintDate: string;
  owner: string;
  serialNumber: number;
  type: string;
}

interface ApiError {
  response?: {
    status: number;
    data?: unknown;
  };
  message?: string;
}

export const fetchUserNfts = async (walletId: string): Promise<Nft[]> => {
  try {
    // Nettoyer l'ID du wallet
    const cleanedWalletId = cleanWalletId(walletId);
    console.log('[fetchUserNfts] ID wallet nettoyé:', cleanedWalletId);
    
    // Récupération du token d'authentification
    console.log('[fetchUserNfts] Récupération du token d\'authentification');
    const authResponse = await apiRequestor.get('/auth/ultra-token');
    const authToken = authResponse.data.access_token;
    console.log('[fetchUserNfts] Token récupéré');

    // Requête GraphQL pour récupérer les NFTs
    const query = `
      query UniqsOfWallet($walletId: WalletId!, $pagination: PaginationInput) {
        uniqsOfWallet(walletId: $walletId, pagination: $pagination) {
          data {
            id
            metadata {
              content {
                name
                description
                medias {
                  square {
                    contentType
                    uri
                  }
                  gallery {
                    contentType
                    uri
                  }
                  hero {
                    contentType
                    uri
                  }
                  product {
                    contentType
                    uri
                  }
                }
              }
            }
            mintDate
            owner
            serialNumber
            type
          }
          pagination {
            limit
            skip
          }
          totalCount
        }
      }
    `;

    const variables = {
      walletId: cleanedWalletId,
      pagination: {
        limit: 25,
        skip: 0
      }
    };

    console.log('[fetchUserNfts] Envoi de la requête GraphQL pour:', cleanedWalletId);
    const response = await fetch(ULTRA_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const responseData = await response.json();
    
    if (responseData.errors) {
      console.error('[fetchUserNfts] Erreurs GraphQL:', responseData.errors);
      throw new Error('Failed to fetch NFTs');
    }

    console.log('[fetchUserNfts] NFTs récupérés avec succès, count:', responseData.data.uniqsOfWallet.data.length);
    return responseData.data.uniqsOfWallet.data;
  } catch (error) {
    console.error('[fetchUserNfts] Erreur complète:', error);
    throw error;
  }
};

export const setUserAvatar = async (blockchainId: string, nftId: string) => {
  try {
    const cleanedBlockchainId = cleanWalletId(blockchainId);
    console.log('[setUserAvatar] ID wallet nettoyé:', cleanedBlockchainId);
    console.log('[setUserAvatar] NFT ID:', nftId);
    
    const response = await apiRequestor.put(`/users/${cleanedBlockchainId}/avatar`, { nftId });
    console.log('[setUserAvatar] Réponse:', response.data);
    return response.data;
  } catch (error) {
    console.error('[setUserAvatar] Erreur de mise à jour de l\'avatar:', error);
    if ((error as any).response) {
      console.error('[setUserAvatar] Statut:', (error as any).response.status);
      console.error('[setUserAvatar] Données:', (error as any).response.data);
    }
    throw error;
  }
};

export const getUserAvatar = async (blockchainId: string) => {
  try {
    const cleanedBlockchainId = cleanWalletId(blockchainId);
    console.log('[getUserAvatar] ID wallet nettoyé:', cleanedBlockchainId);
    
    const response = await apiRequestor.get(`/users/${cleanedBlockchainId}/avatar`);
    console.log('[getUserAvatar] Réponse:', response.data);
    return response.data;
  } catch (error) {
    console.error('[getUserAvatar] Erreur lors de la récupération de l\'avatar:', error);
    
    // Extraire plus de détails sur l'erreur
    const apiError = error as ApiError;
    if (apiError.response) {
      console.error('[getUserAvatar] Statut de la réponse:', apiError.response.status);
      console.error('[getUserAvatar] Données de la réponse:', apiError.response.data);
      
      // Si l'avatar n'est pas défini, retourner null au lieu de lancer une erreur
      if (apiError.response.status === 404) {
        console.log('[getUserAvatar] Avatar non trouvé (404)');
        return null;
      }
    }
    
    throw error;
  }
}; 