import React, {useState, useEffect} from 'react'
import {Uniq, fetchUserUNIQs, getCachedCollections, getCachedUNIQs, UNIQsCollection, isUNIQLoadingComplete} from '../utils/uniqService'

interface UNIQSelectorProps {
  blockchainId: string
  onSelect: (uniq: Uniq) => void
  currentAvatarId?: string
}

const ITEMS_PER_PAGE = 12

const UNIQSelector: React.FC<UNIQSelectorProps> = ({blockchainId, onSelect, currentAvatarId}) => {
  const [UNIQs, setUNIQs] = useState<Uniq[]>([])
  const [filteredUNIQs, setFilteredUNIQs] = useState<Uniq[]>([])
  const [displayedUNIQs, setDisplayedUNIQs] = useState<Uniq[]>([])
  const [collections, setCollections] = useState<UNIQsCollection[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUNIQId, setSelectedUNIQId] = useState<string | null>(currentAvatarId || null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(false)
  const [totalFilteredCount, setTotalFilteredCount] = useState(0)

  useEffect(() => {
    const loadUNIQs = async () => {
      if (!blockchainId) return

      try {
        setInitialLoading(true)
        const userUNIQs = await fetchUserUNIQs(blockchainId)
        setUNIQs(userUNIQs)

        // Récupérer les collections
        const userCollections = getCachedCollections(blockchainId)
        setCollections(userCollections)

        setError(null)
      } catch (err) {
        console.error('Failed to load UNIQs:', err)
        setError('Impossible de charger vos UNIQs. Veuillez réessayer plus tard.')
      } finally {
        setInitialLoading(false)
      }
    }

    loadUNIQs()

    const handleUNIQUpdate = (event: Event) => {
      if (blockchainId) {
        const customEvent = event as CustomEvent<{walletId: string}>
        if (customEvent.detail.walletId === blockchainId) {
          const updatedUNIQs = getCachedUNIQs(blockchainId)
          setUNIQs(updatedUNIQs)

          // Mettre à jour les collections
          const updatedCollections = getCachedCollections(blockchainId)
          setCollections(updatedCollections)
        }
      }
    }

    document.addEventListener('uniqUpdate', handleUNIQUpdate)

    return () => {
      document.removeEventListener('uniqUpdate', handleUNIQUpdate)
    }
  }, [blockchainId])

  useEffect(() => {
    setLoading(true)
    let filtered = [...UNIQs]

    // Filtrer par collection si nécessaire
    if (selectedCollection !== 'all') {
      filtered = filtered.filter(uniq => {
        if (uniq.factory?.id === selectedCollection) return true
        if (uniq.collection?.id === selectedCollection) return true
        if (uniq.metadata.content.subName === selectedCollection) return true
        return false
      })
    }

    // Filtrer par recherche si nécessaire
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        uniq =>
          uniq.metadata.content.name?.toLowerCase().includes(query) ||
          uniq.serialNumber?.toString().includes(query) ||
          uniq.id?.toLowerCase().includes(query) ||
          uniq.attributes?.some((attr: {key: string; value: string | number}) => attr.key.toLowerCase().includes(query) || (typeof attr.value === 'string' && attr.value.toLowerCase().includes(query)) || (typeof attr.value === 'number' && attr.value.toString().includes(query)))
      )
    }

    setFilteredUNIQs(filtered)
    setTotalFilteredCount(filtered.length)
    setCurrentPage(1)
    setLoading(false)
  }, [searchQuery, selectedCollection, UNIQs])

  useEffect(() => {
    setLoading(true)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    setDisplayedUNIQs(filteredUNIQs.slice(startIndex, endIndex))

    const hasMore = filteredUNIQs.length > ITEMS_PER_PAGE * currentPage
    setHasMorePages(hasMore)

    setLoading(false)
  }, [filteredUNIQs, currentPage, blockchainId])

  const handleSelect = (uniq: Uniq) => {
    setSelectedUNIQId(uniq.id)
    onSelect(uniq)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCollection(e.target.value)
  }

  // Pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (hasMorePages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Calcul des informations de pagination
  const totalPages = Math.ceil(totalFilteredCount / ITEMS_PER_PAGE)
  const isLastPage = currentPage >= totalPages && isUNIQLoadingComplete(blockchainId || '')

  if (initialLoading) {
    return (
      <div className='flex justify-center items-center p-8'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500'></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='p-4 bg-red-900/30 text-red-200 rounded-lg'>
        <p>{error}</p>
        <button onClick={() => setInitialLoading(true)} className='mt-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition-colors'>
          Réessayer
        </button>
      </div>
    )
  }

  if (UNIQs.length === 0) {
    return (
      <div className='p-4 bg-dark-900 rounded-lg'>
        <p className='text-gray-400'>Vous ne possédez aucun UNIQs pour le moment.</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className='text-lg font-semibold mb-3'>Sélectionnez un UNIQ pour votre avatar</h3>

      <div className='mb-4 space-y-3'>
        {/* Filtre par collection */}
        {collections.length > 0 && (
          <div>
            <label htmlFor='collection-filter' className='block text-sm font-medium text-gray-400 mb-1'>
              Collection
            </label>
            <div className='relative'>
              <select id='collection-filter' value={selectedCollection} onChange={handleCollectionChange} className='w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500 appearance-none pr-10'>
                <option value='all'>Toutes les collections ({collections.length})</option>
                {collections.map(collection => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name} ({collection.totalItems})
                  </option>
                ))}
              </select>
              <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none'>
                <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Barre de recherche */}
        <div className='relative'>
          <input type='text' value={searchQuery} onChange={handleSearchChange} placeholder='Rechercher par nom, ID, numéro de série ou attribut...' className='w-full px-4 py-2 pl-10 bg-dark-900 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500' />
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Message d'information sur les résultats de recherche */}
      <div className='flex justify-between items-center mb-3'>
        <div className='text-xs text-gray-400'>{filteredUNIQs.length > 0 ? `${filteredUNIQs.length} UNIQ${filteredUNIQs.length > 1 ? 's' : ''} trouvé${filteredUNIQs.length > 1 ? 's' : ''}` : ''}</div>

        {totalPages > 1 && (
          <div className='text-xs text-gray-400'>
            Page {currentPage}/{isUNIQLoadingComplete(blockchainId || '') ? totalPages : totalPages + '+'}
          </div>
        )}
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500'></div>
        </div>
      ) : filteredUNIQs.length === 0 ? (
        <div className='p-4 bg-dark-900 rounded-lg text-center'>
          <p className='text-gray-400'>Aucun UNIQ ne correspond à votre recherche.</p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {displayedUNIQs.map(uniq => {
              const imageUrl = uniq.metadata.content.medias.square?.uri || uniq.metadata.content.medias.product?.uri || uniq.metadata.content.medias.gallery?.uri || uniq.metadata.content.medias.hero?.uri

              const isSelected = selectedUNIQId === uniq.id
              const collectionName = uniq.metadata.content.subName || collections.find(c => c.id === uniq.factory?.id || c.id === uniq.collection?.id)?.name || 'Collection inconnue'

              return (
                <div
                  key={uniq.id}
                  onClick={() => handleSelect(uniq)}
                  className={`
                    relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                    ${isSelected ? 'border-primary-500 scale-105' : 'border-dark-700 hover:border-dark-500'}
                  `}>
                  {imageUrl ? <img src={imageUrl} alt={uniq.metadata.content.name} className='w-full aspect-square object-cover' loading='lazy' /> : <div className='w-full aspect-square bg-dark-800 flex items-center justify-center text-gray-500'>No Image</div>}

                  <div className='absolute bottom-0 left-0 right-0 bg-dark-900/80 p-2'>
                    <p className='text-sm font-medium truncate'>{uniq.metadata.content.name}</p>
                    <div className='flex justify-between text-xs text-gray-400'>
                      <span>#{uniq.serialNumber}</span>
                      <span className='truncate'>{uniq.id ? `ID: ${uniq.id.slice(0, 6)}...` : ''}</span>
                    </div>
                    {/* Nom de la collection */}
                    <div className='mt-1 text-xs text-primary-400 truncate'>{collectionName}</div>
                  </div>

                  {isSelected && (
                    <div className='absolute top-2 right-2 bg-primary-500 rounded-full p-1'>
                      <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex items-center justify-center space-x-4 mt-6'>
              <button onClick={handlePreviousPage} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg transition-colors ${currentPage === 1 ? 'bg-dark-800 text-gray-500 cursor-not-allowed' : 'bg-dark-700 text-white hover:bg-dark-600'}`}>
                Précédent
              </button>

              <button onClick={handleNextPage} disabled={isLastPage || !hasMorePages} className={`px-4 py-2 rounded-lg transition-colors ${isLastPage || !hasMorePages ? 'bg-dark-800 text-gray-500 cursor-not-allowed' : 'bg-dark-700 text-white hover:bg-dark-600'}`}>
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UNIQSelector
