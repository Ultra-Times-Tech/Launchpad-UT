import {useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import {useUltraWallet} from '../../utils/ultraWalletHelper'
import {apiRequestor} from '../../utils/axiosInstanceHelper'
import useAlerts from '../../hooks/useAlert'
import {useTranslation} from '../../hooks/useTranslation'
import {getAssetUrl} from '../../utils/imageHelper'
import {Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Close as CloseIcon, PhotoCamera as PhotoCameraIcon} from '@mui/icons-material'

interface Collection {
  id: number
  name: string
  content?: string
  image: string
  created_by: number
  publish_up?: string
  publish_down?: string
  state?: number
  note?: string
}

interface CollectionApiItem {
  type: string
  id: string
  attributes: {
    id: number
    name: string
    content?: string
    note?: string
    image: string
    created_by: number
    state?: number
    publish_up?: string
    publish_down?: string
    created?: string
    modified?: string
    is_trending?: boolean
    is_featured?: boolean
    ordering?: number
  }
}

interface CollectionApiResponse {
  data: CollectionApiItem[]
  links: {
    self: string
  }
  meta: {
    'total-pages': number
  }
}

interface CollectionFormProps {
  collection?: Collection | null
  onSave: (collection: Partial<Collection>) => void
  onCancel: () => void
  title: string
  submitLabel: string
}

interface ConfirmDeleteProps {
  open: boolean
  collection: Collection | null
  onClose: () => void
  onConfirm: () => void
}

function ConfirmDeleteModal({open, collection, onClose, onConfirm}: ConfirmDeleteProps) {
  // Ref pour le contenu de la modale
  const modalRef = useRef<HTMLDivElement>(null)

  if (!open || !collection) return null

  // Gestion du clic à l'extérieur de la modale
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto' onClick={handleBackdropClick}>
      <div ref={modalRef} className='bg-dark-800 rounded-lg w-full max-w-md mx-4 my-8 overflow-hidden border border-dark-600 shadow-xl'>
        <div className='p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold text-white'>Supprimer la collection</h2>
            <button onClick={onClose} className='text-gray-400 hover:text-white transition-colors'>
              <CloseIcon />
            </button>
          </div>

          <div className='my-6'>
            <p className='text-white text-center mb-2'>Êtes-vous sûr de vouloir supprimer cette collection ?</p>
            <p className='text-gray-400 text-center mb-4 text-sm'>
              <strong>{collection.name}</strong>
            </p>
            <p className='text-gray-400 text-center text-sm'>Cette action est irréversible.</p>
          </div>

          <div className='flex justify-center space-x-3'>
            <button type='button' onClick={onClose} className='px-4 py-2 bg-dark-600 text-white rounded hover:bg-dark-500 transition-colors'>
              Annuler
            </button>
            <button type='button' onClick={onConfirm} className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors'>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CollectionForm({collection, onSave, onCancel, title, submitLabel}: CollectionFormProps) {
  const [name, setName] = useState(collection?.name || '')
  const [content, setContent] = useState(collection?.content || '')
  const [imageUrl, setImageUrl] = useState(collection?.image || '')
  const [publishUp, setPublishUp] = useState(collection?.publish_up || '')
  const [publishDown, setPublishDown] = useState(collection?.publish_down || '')
  const [state, setState] = useState(collection?.state !== undefined ? collection.state : 0)
  const [uploading, setUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Dimensions optimales pour les images de collection
  const OPTIMAL_WIDTH = 2560
  const OPTIMAL_HEIGHT = 1440

  useEffect(() => {
    if (collection) {
      setName(collection.name || '')
      setContent(collection.content || '')
      setImageUrl(collection.image || '')
      setPublishUp(collection.publish_up || '')
      setPublishDown(collection.publish_down || '')
      setState(collection.state !== undefined ? collection.state : 0)
    }
  }, [collection])

  // Gestion du clic à l'extérieur de la modale
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onCancel()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageUrl) {
      setImageError('Une image est requise pour la collection')
      return
    }

    // Préserver la note existante, elle ne peut pas être modifiée par l'interface utilisateur
    const noteToSave = collection?.note || ''

    onSave({
      ...(collection || {}),
      name,
      content,
      image: imageUrl,
      publish_up: publishUp,
      publish_down: publishDown,
      state,
      note: noteToSave, // Utiliser la note existante, pas celle potentiellement modifiée
    })
  }

  const validateImageDimensions = (imgElement: HTMLImageElement): Promise<boolean> => {
    return new Promise(resolve => {
      const checkDimensions = () => {
        const {width, height} = imgElement

        if (width < OPTIMAL_WIDTH || height < OPTIMAL_HEIGHT) {
          setImageError(`L'image doit avoir une dimension minimale de ${OPTIMAL_WIDTH}x${OPTIMAL_HEIGHT} pixels. Dimensions actuelles: ${width}x${height}`)
          resolve(false)
        } else {
          setImageError(null)
          resolve(true)
        }
      }

      if (imgElement.complete) {
        checkDimensions()
      } else {
        imgElement.onload = checkDimensions
      }
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Réinitialiser l'erreur
    setImageError(null)

    // Vérifier le type de fichier
    if (!file.type.match('image.*')) {
      setImageError('Veuillez sélectionner une image (JPG, PNG ou GIF)')
      return
    }

    // Vérifier la taille du fichier (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("L'image est trop grande. Maximum: 5 MB")
      return
    }

    setUploading(true)

    try {
      // Créer un objet URL pour prévisualiser l'image
      const objectUrl = URL.createObjectURL(file)

      // Vérifier les dimensions de l'image
      const img = new Image()
      img.src = objectUrl

      const isValidDimension = await validateImageDimensions(img)

      if (!isValidDimension) {
        URL.revokeObjectURL(objectUrl)
        setUploading(false)
        return
      }

      setUploading(false)
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image", error)
      setImageError('Une erreur est survenue lors du téléchargement')
      setUploading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto' onClick={handleBackdropClick}>
      <div ref={modalRef} className='bg-dark-800 rounded-lg w-full max-w-lg mx-4 my-8 overflow-hidden border border-dark-600 shadow-xl max-h-[90vh]'>
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-48px)]'>
          <div className='flex justify-between items-center mb-6 sticky top-0 bg-dark-800 z-10 py-2'>
            <h2 className='text-2xl font-bold text-white'>{title}</h2>
            <button onClick={onCancel} className='text-gray-400 hover:text-white transition-colors'>
              <CloseIcon />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='mb-5'>
              <label className='block text-gray-300 mb-2 font-medium'>Nom</label>
              <input type='text' value={name} onChange={e => setName(e.target.value)} className='w-full bg-dark-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-dark-600' required placeholder='Nom de la collection' />
            </div>

            <div className='mb-5'>
              <label className='block text-gray-300 mb-2 font-medium'>Description</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} className='w-full bg-dark-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px] border border-dark-600' placeholder='Description de la collection' />
            </div>

            <div className='mb-5'>
              <label className='block text-gray-300 mb-2 font-medium'>État</label>
              <select value={state} onChange={e => setState(Number(e.target.value))} className='w-full bg-dark-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-dark-600'>
                <option value='0'>Brouillon</option>
                <option value='1'>Publié</option>
              </select>
            </div>

            <div className='mb-5'>
              <label className='block text-gray-300 mb-2 font-medium'>Date de publication</label>
              <input type='datetime-local' value={publishUp ? publishUp.replace(' ', 'T') : ''} onChange={e => setPublishUp(e.target.value.replace('T', ' '))} className='w-full bg-dark-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-dark-600' />
            </div>

            <div className='mb-5'>
              <label className='block text-gray-300 mb-2 font-medium'>Date de fin de publication</label>
              <input type='datetime-local' value={publishDown ? publishDown.replace(' ', 'T') : ''} onChange={e => setPublishDown(e.target.value.replace('T', ' '))} className='w-full bg-dark-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 border border-dark-600' />
            </div>

            <div className='mb-6'>
              <div className='flex items-center justify-between mb-2'>
                <label className='text-gray-300 font-medium flex items-center'>
                  <PhotoCameraIcon className='mr-2' fontSize='small' />
                  Image
                </label>
                <div className='bg-primary-900/50 px-3 py-1 rounded-md text-white text-sm border border-primary-500/30'>
                  Dimensions: {OPTIMAL_WIDTH} × {OPTIMAL_HEIGHT}px
                </div>
              </div>

              <div className='flex flex-col items-center justify-center border-2 border-dashed border-dark-600 rounded-lg p-4 bg-dark-700 transition-colors hover:border-primary-500/50 mb-3'>
                <input type='file' ref={fileInputRef} onChange={handleFileUpload} accept='image/jpeg,image/png,image/gif' className='hidden' aria-label='Télécharger une image' />

                {uploading ? (
                  <div className='flex flex-col items-center justify-center py-4'>
                    <div className='w-10 h-10 border-t-2 border-b-2 border-primary-500 rounded-full animate-spin mb-2'></div>
                    <p className='text-white'>Téléchargement en cours...</p>
                  </div>
                ) : (
                  <button type='button' onClick={() => fileInputRef.current?.click()} className='flex flex-col items-center justify-center py-4 w-full' aria-label='Cliquez pour télécharger une image'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-10 w-10 text-gray-300 mb-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                    </svg>
                    <p className='text-white font-medium mb-2'>Cliquez pour télécharger une image</p>
                    <div className='bg-primary-500/20 px-3 py-1 rounded-md mb-1'>
                      <p className='text-white text-sm'>Format: PNG, JPG ou GIF (max 5 MB)</p>
                    </div>
                    <div className='bg-primary-500/20 px-3 py-1 rounded-md'>
                      <p className='text-white text-sm'>
                        Taille minimale: {OPTIMAL_WIDTH}x{OPTIMAL_HEIGHT}px
                      </p>
                    </div>
                  </button>
                )}
              </div>

              {imageError && (
                <div className='bg-red-900/30 border border-red-500/30 text-white text-sm p-3 rounded-md mt-2 mb-3'>
                  <div className='flex items-start'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5' viewBox='0 0 20 20' fill='currentColor'>
                      <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                    </svg>
                    {imageError}
                  </div>
                </div>
              )}

              {imageUrl && !imageError && (
                <div className='mt-3 p-3 border border-dark-600 rounded-lg bg-dark-700'>
                  <p className='text-white font-medium mb-2'>Aperçu :</p>
                  <div className='aspect-w-16 aspect-h-9 rounded-md overflow-hidden'>
                    <img
                      src={getAssetUrl(imageUrl)}
                      alt='Aperçu'
                      className='w-full h-full object-cover'
                      onError={e => {
                        const target = e.target as HTMLImageElement
                        target.src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='
                        setImageError("Impossible de charger l'image")
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className='flex justify-end space-x-3 pt-2'>
              <button type='button' onClick={onCancel} className='px-5 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors'>
                Annuler
              </button>
              <button type='submit' className='px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium' disabled={uploading || !!imageError}>
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function MyCollectionsPage() {
  const {blockchainId} = useUltraWallet()
  const {t} = useTranslation()
  const {error: showError, success: showSuccess} = useAlerts()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // États pour les modales
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null)

  const loadCollections = async () => {
    if (!blockchainId) return

    setLoading(true)
    try {
      // Récupérer l'ID utilisateur à partir du wallet
      const userResponse = await apiRequestor.get(`/users/wallets/${blockchainId}`)
      const userId = userResponse.data.data[0].id

      // Récupérer les collections avec l'ID utilisateur
      const collectionsResponse = await apiRequestor.get<CollectionApiResponse>(`/collections`, {
        params: {
          search: `uid:${userId}`,
        },
      })

      // Récupérer individuellement chaque collection pour avoir toutes les données
      const completeCollections = await Promise.all(
        collectionsResponse.data.data.map(async (item: CollectionApiItem) => {
          try {
            // Récupérer les détails complets de chaque collection
            const detailResponse = await apiRequestor.get(`/collections/${item.attributes.id}`)
            console.log(`Detail for collection ${item.attributes.id}:`, detailResponse.data)
            return detailResponse.data.data
          } catch (err) {
            console.error(`Error fetching details for collection ${item.attributes.id}:`, err)
            return item // Fallback to original item if detail fetch fails
          }
        })
      )

      // Transformer les données complètes
      const collectionData = completeCollections.map((item: CollectionApiItem) => {
        // S'assurer que tous les champs sont présents avec des valeurs par défaut si nécessaire
        return {
          id: item.attributes.id,
          name: item.attributes.name,
          content: item.attributes.content || '',
          note: item.attributes.note || '',
          image: item.attributes.image,
          created_by: item.attributes.created_by,
          publish_up: item.attributes.publish_up,
          publish_down: item.attributes.publish_down,
          state: item.attributes.state !== undefined ? item.attributes.state : 0,
        }
      })

      console.log('Processed collection data:', collectionData)
      setCollections(collectionData)
    } catch (err) {
      showError('Erreur lors du chargement des collections')
      console.error('Erreur lors du chargement des collections:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCollections()
  }, [blockchainId, showError])

  const filteredCollections = collections.filter(collection => collection.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handlers pour les actions
  const handleEditClick = (collection: Collection) => {
    // S'assurer que tous les champs sont présents
    const completeCollection = {
      ...collection,
      content: collection.content || '',
      note: collection.note || '',
      publish_up: collection.publish_up || '',
      publish_down: collection.publish_down || '',
      state: collection.state !== undefined ? collection.state : 0,
    }

    setCurrentCollection(completeCollection)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (collection: Collection) => {
    setCurrentCollection(collection)
    setDeleteModalOpen(true)
  }

  const handleCreateClick = () => {
    setCreateModalOpen(true)
  }

  const handleSaveCollection = async (updatedCollection: Partial<Collection>) => {
    try {
      if (!updatedCollection.id) {
        showError('ID de collection manquant')
        return
      }

      await apiRequestor.patch(`/collections/${updatedCollection.id}`, {
        name: updatedCollection.name,
        content: updatedCollection.content,
        image: updatedCollection.image,
        publish_up: updatedCollection.publish_up,
        publish_down: updatedCollection.publish_down,
        state: updatedCollection.state,
        note: updatedCollection.note,
      })

      showSuccess('Collection mise à jour avec succès !')

      // Mettre à jour la collection dans l'état local
      setCollections(prev => prev.map(c => (c.id === updatedCollection.id ? ({...c, ...updatedCollection} as Collection) : c)))

      setEditModalOpen(false)
    } catch (err) {
      showError('Erreur lors de la mise à jour de la collection')
      console.error('Erreur lors de la mise à jour:', err)
    }
  }

  const handleCreateCollection = async (newCollection: Partial<Collection>) => {
    try {
      // Récupérer l'ID utilisateur à partir du wallet
      const userResponse = await apiRequestor.get(`/users/wallets/${blockchainId}`)
      const userId = userResponse.data.data[0].id

      await apiRequestor.post('/collections', {
        name: newCollection.name,
        content: newCollection.content,
        image: newCollection.image,
        created_by: userId,
        publish_up: newCollection.publish_up,
        publish_down: newCollection.publish_down,
        state: newCollection.state !== undefined ? newCollection.state : 0,
        note: newCollection.note,
      })

      showSuccess('Collection créée avec succès !')

      // Recharger les collections pour inclure la nouvelle
      await loadCollections()

      setCreateModalOpen(false)
    } catch (err) {
      showError('Erreur lors de la création de la collection')
      console.error('Erreur lors de la création:', err)
    }
  }

  const handleDeleteCollection = async () => {
    if (!currentCollection) return

    try {
      await apiRequestor.delete(`/collections/${currentCollection.id}`)

      showSuccess('Collection supprimée avec succès !')

      // Supprimer la collection de l'état local
      setCollections(prev => prev.filter(c => c.id !== currentCollection.id))

      setDeleteModalOpen(false)
    } catch (err) {
      showError('Erreur lors de la suppression de la collection')
      console.error('Erreur lors de la suppression:', err)
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-white'>{t('my_collections')}</h1>
        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <input type='text' placeholder='Rechercher une collection...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='bg-dark-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-64' />
          </div>
          <button className='bg-primary-600 hover:bg-primary-500 text-white rounded-lg px-4 py-2 flex items-center transition-colors' onClick={handleCreateClick}>
            <AddIcon fontSize='small' className='mr-2' />
            Créer
          </button>
        </div>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500'></div>
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-400 text-lg'>{searchTerm ? 'Aucune collection trouvée pour cette recherche' : "Vous n'avez pas encore créé de collection"}</p>
          {!searchTerm && (
            <button onClick={handleCreateClick} className='mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors'>
              Créer votre première collection
            </button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredCollections.map(collection => (
            <div key={collection.id} className='bg-dark-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300'>
              <div className='aspect-w-16 aspect-h-9 relative group'>
                <img src={getAssetUrl(collection.image)} alt={collection.name} className='w-full h-full object-cover' />
                <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                  <div className='flex space-x-3'>
                    <Link to={`/collection/${collection.id}`} className='bg-primary-600 hover:bg-primary-500 text-white p-2 rounded-full transition-colors'>
                      <span className='sr-only'>Voir</span>
                      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
                        <circle cx='12' cy='12' r='3'></circle>
                      </svg>
                    </Link>
                    <button onClick={() => handleEditClick(collection)} className='bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full transition-colors'>
                      <span className='sr-only'>Modifier</span>
                      <EditIcon />
                    </button>
                    <button onClick={() => handleDeleteClick(collection)} className='bg-red-600 hover:bg-red-500 text-white p-2 rounded-full transition-colors'>
                      <span className='sr-only'>Supprimer</span>
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
              <div className='p-4'>
                <h3 className='text-xl font-semibold text-white mb-2'>{collection.name}</h3>
                <p className='text-gray-400 line-clamp-2'>{collection.content || 'Aucune description'}</p>
                <div className='mt-4 flex justify-between items-center'>
                  <span className='text-xs text-gray-500'>ID: {collection.id}</span>
                  <Link to={`/collection/${collection.id}`} className='text-primary-500 hover:text-primary-400 text-sm font-medium transition-colors'>
                    Voir les détails →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modales */}
      {editModalOpen && <CollectionForm collection={currentCollection} onSave={handleSaveCollection} onCancel={() => setEditModalOpen(false)} title='Modifier la collection' submitLabel='Enregistrer' />}

      {createModalOpen && <CollectionForm onSave={handleCreateCollection} onCancel={() => setCreateModalOpen(false)} title='Créer une nouvelle collection' submitLabel='Créer' />}

      <ConfirmDeleteModal open={deleteModalOpen} collection={currentCollection} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteCollection} />
    </div>
  )
}

export default MyCollectionsPage
