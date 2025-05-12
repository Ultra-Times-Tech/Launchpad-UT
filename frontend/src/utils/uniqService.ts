import {apiRequestor} from './axiosInstanceHelper'
import {cleanWalletId} from './ultraWalletHelper'

const ULTRA_GRAPHQL_ENDPOINT = 'https://staging.api.ultra.io/graphql'

export interface Uniq {
  id: string
  serialNumber: string
  metadata: {
    content: {
      name: string
      description?: string
      subName?: string // Nom de la collection
      medias: {
        square?: {uri: string}
        product?: {uri: string}
        gallery?: {uri: string}
        hero?: {uri: string}
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
          square?: {uri: string}
          product?: {uri: string}
          gallery?: {uri: string}
          hero?: {uri: string}
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

export interface UNIQsCollection {
  id: string
  name: string
  description?: string
  image?: string
  uniqs: Uniq[]
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
export const nftUpdateEvent = new CustomEvent('nftUpdate')

// Stockage global des UNIQs par wallet pour éviter des requêtes répétées
const uniqCache: Record<
  string,
  {
    uniqs: Uniq[]
    collections: UNIQsCollection[]
    lastUpdated: number
    isComplete: boolean
  }
> = {}

// Durée de validité du cache en millisecondes (5 minutes)
const CACHE_VALIDITY = 5 * 60 * 1000

/**
 * Charge les UNIQs d'un utilisateur avec pagination et mise en cache
 * @param walletId ID du portefeuille
 * @param limit Nombre de UNIQs par page
 * @param forceRefresh Forcer le rafraîchissement du cache
 * @returns Tableau des UNIQs disponibles actuellement
 */
export const fetchUserUNIQs = async (walletId: string, limit = 25, forceRefresh = false): Promise<Uniq[]> => {
  // Nettoyer l'ID du wallet
  const cleanedWalletId = cleanWalletId(walletId)

  // Vérifier le cache
  if (!forceRefresh && uniqCache[cleanedWalletId] && Date.now() - uniqCache[cleanedWalletId].lastUpdated < CACHE_VALIDITY) {
    return uniqCache[cleanedWalletId].uniqs
  }

  // Initialiser/réinitialiser le cache si nécessaire
  if (forceRefresh || !uniqCache[cleanedWalletId]) {
    uniqCache[cleanedWalletId] = {
      uniqs: [],
      collections: [],
      lastUpdated: Date.now(),
      isComplete: false,
    }
  }

  try {
    const initialUNIQs = await fetchUNIQBatch(cleanedWalletId, limit, 0)

    const collections = organizeUNIQsByCollection(initialUNIQs.uniqs)

    uniqCache[cleanedWalletId] = {
      uniqs: initialUNIQs.uniqs,
      collections,
      lastUpdated: Date.now(),
      isComplete: initialUNIQs.totalCount <= limit,
    }

    if (!uniqCache[cleanedWalletId].isComplete) {
      loadRemainingUNIQs(cleanedWalletId, limit, initialUNIQs.totalCount)
    }

    return uniqCache[cleanedWalletId].uniqs
  } catch (error) {
    console.error('[fetchUserUNIQs] Erreur complète:', error)
    throw error
  }
}

const organizeUNIQsByCollection = (uniqs: Uniq[]): UNIQsCollection[] => {
  const collectionsMap: Record<string, UNIQsCollection> = {}

  uniqs.forEach(uniq => {
    let collectionId: string
    let collectionName: string
    let collectionDescription: string | undefined
    let collectionImage: string | undefined

    // Tenter d'extraire les informations de collection depuis factory
    if (uniq.factory?.id) {
      collectionId = uniq.factory.id
      collectionName = uniq.factory.metadata?.content?.name || uniq.metadata.content.subName || 'Collection inconnue'
      collectionDescription = uniq.factory.metadata?.content?.description

      // Tenter de récupérer une image pour la collection
      const factoryMedia = uniq.factory.metadata?.content?.medias
      collectionImage = factoryMedia?.square?.uri || factoryMedia?.product?.uri || factoryMedia?.gallery?.uri || factoryMedia?.hero?.uri
    } else if (uniq.collection?.id) {
      collectionId = uniq.collection.id
      collectionName = uniq.collection.name || 'Collection inconnue'
      collectionDescription = uniq.collection.description
      collectionImage = uniq.collection.image
    } else if (uniq.metadata.content.subName) {
      collectionId = uniq.metadata.content.subName
      collectionName = uniq.metadata.content.subName
    } else {
      collectionId = 'sans-collection'
      collectionName = 'UNIQs divers'
    }

    // Créer ou mettre à jour la collection dans le map
    if (!collectionsMap[collectionId]) {
      collectionsMap[collectionId] = {
        id: collectionId,
        name: collectionName,
        description: collectionDescription,
        image: collectionImage,
        uniqs: [],
        totalItems: 0,
      }
    }

    // Ajouter le NFT à sa collection
    collectionsMap[collectionId].uniqs.push(uniq)
    collectionsMap[collectionId].totalItems++
  })

  // Convertir le map en tableau
  return Object.values(collectionsMap)
}

/**
 * @param walletId
 * @param limit
 * @param skip
 * @returns
 */
const fetchUNIQBatch = async (
  walletId: string,
  limit: number,
  skip: number
): Promise<{
  uniqs: Uniq[]
  totalCount: number
}> => {
  const authResponse = await apiRequestor.get('/auth/ultra-token')
  const authToken = authResponse.data.access_token

  // Requête GraphQL pour récupérer les UNIQs
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
  `

  const variables = {
    walletId,
    pagination: {
      limit,
      skip,
    },
  }

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
  })

  const responseData = await response.json()

  if (responseData.errors) {
    console.error('[fetchUNIQBatch] Erreurs GraphQL:', responseData.errors)
    throw new Error('Failed to fetch UNIQs')
  }

  const result = responseData.data.uniqsOfWallet

  const processedUNIQs = result.data.map(
    (uniq: {
      id: string
      serialNumber: string
      metadata?: {
        content?: {
          name: string
          description?: string
          subName?: string
          attributes?: Array<{key: string; value: string | number}>
          medias: {
            square?: {uri: string}
            product?: {uri: string}
            gallery?: {uri: string}
            hero?: {uri: string}
          }
        }
      }
      factory?: {
        id: string
        metadata?: {
          content?: {
            name?: string
            description?: string
            medias?: {
              square?: {uri: string}
              product?: {uri: string}
              gallery?: {uri: string}
              hero?: {uri: string}
            }
          }
        }
      }
      mintDate?: string
      owner?: string
      type?: string
    }) => {
      const attributes =
        uniq.metadata?.content?.attributes?.map((attr: {key: string; value: string | number}) => ({
          key: attr.key,
          value: attr.value,
        })) || []

      return {
        ...uniq,
        attributes,
      }
    }
  )

  return {
    uniqs: processedUNIQs,
    totalCount: result.totalCount,
  }
}

/**
 * Charge les UNIQs restants en arrière-plan
 * @param walletId ID du portefeuille
 * @param limit Nombre de UNIQs par page
 * @param totalCount Nombre total de UNIQs
 */
const loadRemainingUNIQs = async (walletId: string, limit: number, totalCount: number) => {
  try {
    let loadedCount = uniqCache[walletId]?.uniqs.length || 0

    while (loadedCount < totalCount) {
      const nextBatch = await fetchUNIQBatch(walletId, limit, loadedCount)

      // Mettre à jour le cache
      if (uniqCache[walletId]) {
        // Ajouter les nouveaux UNIQs
        uniqCache[walletId].uniqs = [...uniqCache[walletId].uniqs, ...nextBatch.uniqs]

        // Réorganiser les collections avec tous les UNIQs
        uniqCache[walletId].collections = organizeUNIQsByCollection(uniqCache[walletId].uniqs)

        uniqCache[walletId].lastUpdated = Date.now()
        loadedCount = uniqCache[walletId].uniqs.length

        // Déclencher l'événement de mise à jour
        document.dispatchEvent(new CustomEvent('uniqUpdate', {detail: {walletId}}))
      } else {
        // Le cache a été supprimé entre-temps, interrompre le chargement
        break
      }

      // Vérifier si tous les UNIQs sont chargés
      if (loadedCount >= totalCount) {
        if (uniqCache[walletId]) {
          uniqCache[walletId].isComplete = true
        }
        break
      }
    }

  } catch (error) {
    console.error('[loadRemainingUNIQs] Erreur lors du chargement:', error)
  }
}

/**
 * Récupère les UNIQs actuellement en cache pour un wallet
 * @param walletId ID du portefeuille
 * @returns Tableau des UNIQs en cache ou tableau vide
 */
export const getCachedUNIQs = (walletId: string): Uniq[] => {
  const cleanedWalletId = cleanWalletId(walletId)
  return uniqCache[cleanedWalletId]?.uniqs || []
}

/**
 * Récupère les collections actuellement en cache pour un wallet
 * @param walletId ID du portefeuille
 * @returns Tableau des collections en cache ou tableau vide
 */
export const getCachedCollections = (walletId: string): UNIQsCollection[] => {
  const cleanedWalletId = cleanWalletId(walletId)
  return uniqCache[cleanedWalletId]?.collections || []
}

/**
 * Vérifie si tous les UNIQs ont été chargés pour un wallet
 * @param walletId ID du portefeuille
 * @returns true si tous les UNIQs sont chargés, false sinon
 */
export const isUNIQLoadingComplete = (walletId: string): boolean => {
  const cleanedWalletId = cleanWalletId(walletId)
  return !!uniqCache[cleanedWalletId]?.isComplete
}

export const getUserAvatar = async (blockchainId: string) => {
  try {
    const cleanedBlockchainId = cleanWalletId(blockchainId)

    const response = await apiRequestor.get(`/users/${cleanedBlockchainId}/avatar`)

    // Si on a un avatar défini
    if (response.data && response.data.nft_id) {
      const nftId = response.data.nft_id

      // Charger les détails du NFT pour obtenir l'URL de l'image
      try {
        const userNfts = await fetchUserUNIQs(blockchainId)
        const avatarNft = userNfts.find(uniq => uniq.id === nftId.toString())

        if (avatarNft) {
          const imageUrl = avatarNft.metadata.content.medias.square?.uri || avatarNft.metadata.content.medias.product?.uri || avatarNft.metadata.content.medias.gallery?.uri || avatarNft.metadata.content.medias.hero?.uri

          return {
            nftId: nftId.toString(),
            imageUrl: imageUrl || null,
          }
        }
      } catch (err) {
        console.error('[getUserAvatar] Erreur lors de la récupération des détails du NFT:', err)
      }

      // Si on n'a pas pu récupérer l'image, on retourne quand même l'ID du NFT
      return {nftId: nftId.toString(), imageUrl: null}
    }

    // Pas d'avatar défini
    return {nftId: null, imageUrl: null}
  } catch (error) {
    console.error("[getUserAvatar] Erreur lors de la récupération de l'avatar:", error)

    // Extraire plus de détails sur l'erreur
    const apiError = error as ApiError
    if (apiError.response) {
      console.error('[getUserAvatar] Statut de la réponse:', apiError.response.status)
      console.error('[getUserAvatar] Données de la réponse:', apiError.response.data)

      // Si l'avatar n'est pas défini, retourner null au lieu de lancer une erreur
      if (apiError.response.status === 404) {
        return {nftId: null, imageUrl: null}
      }
    }

    throw error
  }
}
