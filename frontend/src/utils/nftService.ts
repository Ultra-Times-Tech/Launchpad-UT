import {apiRequestor} from './axiosInstanceHelper'
import {cleanWalletId} from './ultraWalletHelper'

const ULTRA_GRAPHQL_ENDPOINT = 'https://staging.api.ultra.io/graphql'

export interface Nft {
  id: string
  serialNumber: string
  metadata: {
    content: {
      name: string
      description?: string
      subName?: string // Nom de la collection
      medias: {
        square?: { uri: string }
        product?: { uri: string }
        gallery?: { uri: string }
        hero?: { uri: string }
      }
    }
  }
  collection?: {
    name: string
    id: string
    description?: string
    image?: string
  }
  factory?: {
    id: string
    metadata?: {
      content?: {
        name?: string
        description?: string
        medias?: {
          square?: { uri: string }
          product?: { uri: string }
          gallery?: { uri: string }
          hero?: { uri: string }
        }
      }
    }
  }
  mintDate?: string
  attributes?: Array<{
    key: string
    value: string | number
  }>
}

export interface NftCollection {
  id: string
  name: string
  description?: string
  image?: string
  nfts: Nft[]
  totalItems: number
}

interface ApiError {
  response?: {
    status: number
    data?: unknown
  }
  message?: string
}

// Événement global pour signaler les mises à jour de NFT
export const nftUpdateEvent = new CustomEvent('nftUpdate');

// Stockage global des NFTs par wallet pour éviter des requêtes répétées
const nftCache: Record<string, { 
  nfts: Nft[], 
  collections: NftCollection[],
  lastUpdated: number, 
  isComplete: boolean 
}> = {};

// Durée de validité du cache en millisecondes (5 minutes)
const CACHE_VALIDITY = 5 * 60 * 1000;

/**
 * Charge les NFTs d'un utilisateur avec pagination et mise en cache
 * @param walletId ID du portefeuille
 * @param limit Nombre de NFTs par page
 * @param forceRefresh Forcer le rafraîchissement du cache
 * @returns Tableau des NFTs disponibles actuellement
 */
export const fetchUserNfts = async (walletId: string, limit = 25, forceRefresh = false): Promise<Nft[]> => {
  // Nettoyer l'ID du wallet
  const cleanedWalletId = cleanWalletId(walletId);
  
  // Vérifier le cache
  if (!forceRefresh && nftCache[cleanedWalletId] && 
      Date.now() - nftCache[cleanedWalletId].lastUpdated < CACHE_VALIDITY) {
    console.log('[fetchUserNfts] Utilisation du cache pour:', cleanedWalletId);
    return nftCache[cleanedWalletId].nfts;
  }
  
  // Initialiser/réinitialiser le cache si nécessaire
  if (forceRefresh || !nftCache[cleanedWalletId]) {
    nftCache[cleanedWalletId] = {
      nfts: [],
      collections: [],
      lastUpdated: Date.now(),
      isComplete: false
    };
  }
  
  try {
    // Première requête pour obtenir les NFTs initiaux et afficher rapidement
    const initialNfts = await fetchNftBatch(cleanedWalletId, limit, 0);
    
    // Organiser les NFTs par collection
    const collections = organizeNftsByCollection(initialNfts.nfts);
    
    // Mettre à jour le cache avec la première page
    nftCache[cleanedWalletId] = {
      nfts: initialNfts.nfts,
      collections,
      lastUpdated: Date.now(),
      isComplete: initialNfts.totalCount <= limit
    };
    
    // Si nous n'avons pas tous les NFTs, démarrer le chargement en arrière-plan
    if (!nftCache[cleanedWalletId].isComplete) {
      loadRemainingNfts(cleanedWalletId, limit, initialNfts.totalCount);
    }
    
    return nftCache[cleanedWalletId].nfts;
  } catch (error) {
    console.error('[fetchUserNfts] Erreur complète:', error);
    throw error;
  }
};

/**
 * Organise les NFTs par collection
 */
const organizeNftsByCollection = (nfts: Nft[]): NftCollection[] => {
  const collectionsMap: Record<string, NftCollection> = {};
  
  nfts.forEach(nft => {
    let collectionId: string;
    let collectionName: string;
    let collectionDescription: string | undefined;
    let collectionImage: string | undefined;
    
    // Tenter d'extraire les informations de collection depuis factory
    if (nft.factory?.id) {
      collectionId = nft.factory.id;
      collectionName = nft.factory.metadata?.content?.name || nft.metadata.content.subName || 'Collection inconnue';
      collectionDescription = nft.factory.metadata?.content?.description;
      
      // Tenter de récupérer une image pour la collection
      const factoryMedia = nft.factory.metadata?.content?.medias;
      collectionImage = factoryMedia?.square?.uri || 
                       factoryMedia?.product?.uri || 
                       factoryMedia?.gallery?.uri || 
                       factoryMedia?.hero?.uri;
    } 
    // Utiliser les informations de collection existantes
    else if (nft.collection?.id) {
      collectionId = nft.collection.id;
      collectionName = nft.collection.name || 'Collection inconnue';
      collectionDescription = nft.collection.description;
      collectionImage = nft.collection.image;
    } 
    // Utiliser subName comme identifiant de collection
    else if (nft.metadata.content.subName) {
      collectionId = nft.metadata.content.subName;
      collectionName = nft.metadata.content.subName;
    } 
    // Fallback pour les NFTs sans collection
    else {
      collectionId = 'sans-collection';
      collectionName = 'NFTs divers';
    }
    
    // Créer ou mettre à jour la collection dans le map
    if (!collectionsMap[collectionId]) {
      collectionsMap[collectionId] = {
        id: collectionId,
        name: collectionName,
        description: collectionDescription,
        image: collectionImage,
        nfts: [],
        totalItems: 0
      };
    }
    
    // Ajouter le NFT à sa collection
    collectionsMap[collectionId].nfts.push(nft);
    collectionsMap[collectionId].totalItems++;
  });
  
  // Convertir le map en tableau
  return Object.values(collectionsMap);
};

/**
 * Charge une page de NFTs
 * @param walletId ID du portefeuille
 * @param limit Nombre de NFTs par page
 * @param skip Nombre de NFTs à sauter
 * @returns Les NFTs récupérés et le nombre total
 */
const fetchNftBatch = async (walletId: string, limit: number, skip: number): Promise<{
  nfts: Nft[],
  totalCount: number
}> => {
  console.log(`[fetchNftBatch] Chargement des NFTs ${skip} à ${skip + limit} pour: ${walletId}`);
  
  // Récupération du token d'authentification
  const authResponse = await apiRequestor.get('/auth/ultra-token');
  const authToken = authResponse.data.access_token;

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
              subName
              attributes {
                key
                value
              }
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
          factory {
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
    walletId,
    pagination: {
      limit,
      skip,
    },
  };

  const response = await fetch(ULTRA_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const responseData = await response.json();

  if (responseData.errors) {
    console.error('[fetchNftBatch] Erreurs GraphQL:', responseData.errors);
    throw new Error('Failed to fetch NFTs');
  }

  const result = responseData.data.uniqsOfWallet;
  console.log(`[fetchNftBatch] NFTs récupérés: ${result.data.length}, total: ${result.totalCount}`);
  
  // Traiter les attributs pour chaque NFT
  const processedNfts = result.data.map((nft: any) => {
    const attributes = nft.metadata?.content?.attributes?.map((attr: any) => ({
      key: attr.key,
      value: attr.value
    })) || [];
    
    return {
      ...nft,
      attributes
    };
  });
  
  return {
    nfts: processedNfts,
    totalCount: result.totalCount
  };
};

/**
 * Charge les NFTs restants en arrière-plan
 * @param walletId ID du portefeuille
 * @param limit Nombre de NFTs par page
 * @param totalCount Nombre total de NFTs
 */
const loadRemainingNfts = async (walletId: string, limit: number, totalCount: number) => {
  try {
    let loadedCount = nftCache[walletId]?.nfts.length || 0;
    
    while (loadedCount < totalCount) {
      console.log(`[loadRemainingNfts] Chargement des NFTs suivants: ${loadedCount}/${totalCount}`);
      
      // Charger la prochaine page
      const nextBatch = await fetchNftBatch(walletId, limit, loadedCount);
      
      // Mettre à jour le cache
      if (nftCache[walletId]) {
        // Ajouter les nouveaux NFTs
        nftCache[walletId].nfts = [
          ...nftCache[walletId].nfts,
          ...nextBatch.nfts
        ];
        
        // Réorganiser les collections avec tous les NFTs
        nftCache[walletId].collections = organizeNftsByCollection(nftCache[walletId].nfts);
        
        nftCache[walletId].lastUpdated = Date.now();
        loadedCount = nftCache[walletId].nfts.length;
        
        // Déclencher l'événement de mise à jour
        document.dispatchEvent(new CustomEvent('nftUpdate', { detail: { walletId } }));
      } else {
        // Le cache a été supprimé entre-temps, interrompre le chargement
        break;
      }
      
      // Vérifier si tous les NFTs sont chargés
      if (loadedCount >= totalCount) {
        if (nftCache[walletId]) {
          nftCache[walletId].isComplete = true;
        }
        break;
      }
    }
    
    console.log(`[loadRemainingNfts] Chargement terminé: ${loadedCount} NFTs chargés`);
  } catch (error) {
    console.error('[loadRemainingNfts] Erreur lors du chargement:', error);
  }
};

/**
 * Récupère les NFTs actuellement en cache pour un wallet
 * @param walletId ID du portefeuille
 * @returns Tableau des NFTs en cache ou tableau vide
 */
export const getCachedNfts = (walletId: string): Nft[] => {
  const cleanedWalletId = cleanWalletId(walletId);
  return nftCache[cleanedWalletId]?.nfts || [];
};

/**
 * Récupère les collections actuellement en cache pour un wallet
 * @param walletId ID du portefeuille
 * @returns Tableau des collections en cache ou tableau vide
 */
export const getCachedCollections = (walletId: string): NftCollection[] => {
  const cleanedWalletId = cleanWalletId(walletId);
  return nftCache[cleanedWalletId]?.collections || [];
};

/**
 * Vérifie si tous les NFTs ont été chargés pour un wallet
 * @param walletId ID du portefeuille
 * @returns true si tous les NFTs sont chargés, false sinon
 */
export const isNftLoadingComplete = (walletId: string): boolean => {
  const cleanedWalletId = cleanWalletId(walletId);
  return !!nftCache[cleanedWalletId]?.isComplete;
};

export const getUserAvatar = async (blockchainId: string) => {
  try {
    const cleanedBlockchainId = cleanWalletId(blockchainId)
    console.log('[getUserAvatar] ID wallet nettoyé:', cleanedBlockchainId)

    const response = await apiRequestor.get(`/users/${cleanedBlockchainId}/avatar`)
    console.log('[getUserAvatar] Réponse:', response.data)
    
    // Si on a un avatar défini
    if (response.data && response.data.nft_id) {
      const nftId = response.data.nft_id;
      
      // Charger les détails du NFT pour obtenir l'URL de l'image
      try {
        const userNfts = await fetchUserNfts(blockchainId);
        const avatarNft = userNfts.find(nft => nft.id === nftId.toString());
        
        if (avatarNft) {
          const imageUrl = avatarNft.metadata.content.medias.square?.uri || 
                       avatarNft.metadata.content.medias.product?.uri || 
                       avatarNft.metadata.content.medias.gallery?.uri ||
                       avatarNft.metadata.content.medias.hero?.uri;
          
          return { 
            nftId: nftId.toString(), 
            imageUrl: imageUrl || null 
          };
        }
      } catch (err) {
        console.error('[getUserAvatar] Erreur lors de la récupération des détails du NFT:', err);
      }
      
      // Si on n'a pas pu récupérer l'image, on retourne quand même l'ID du NFT
      return { nftId: nftId.toString(), imageUrl: null };
    }
    
    // Pas d'avatar défini
    return { nftId: null, imageUrl: null };
  } catch (error) {
    console.error("[getUserAvatar] Erreur lors de la récupération de l'avatar:", error)

    // Extraire plus de détails sur l'erreur
    const apiError = error as ApiError
    if (apiError.response) {
      console.error('[getUserAvatar] Statut de la réponse:', apiError.response.status)
      console.error('[getUserAvatar] Données de la réponse:', apiError.response.data)

      // Si l'avatar n'est pas défini, retourner null au lieu de lancer une erreur
      if (apiError.response.status === 404) {
        console.log('[getUserAvatar] Avatar non trouvé (404)')
        return { nftId: null, imageUrl: null };
      }
    }

    throw error
  }
}
