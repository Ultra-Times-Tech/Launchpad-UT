import {useState, useEffect} from 'react'
import CollectionCard from '../components/Card/CollectionCard'
import FilterBar, {FilterCategory, SortOption, PriceRange} from '../components/FilterBar/FilterBar'
import {CollectionCardProps} from '../types/collection.types'
import {collectionsService} from '../services/collections.service'
import {generateMockCollections, isPriceInRange} from '../data/collections.data'

function CollectionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [collections, setCollections] = useState<CollectionCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<Set<FilterCategory>>(new Set())
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<Set<PriceRange>>(new Set())
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  const collectionsPerPage = 9

  // Filter and sort collections
  const filteredCollections = collections
    .filter(collection => {
      const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) || collection.artist.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategories.size === 0 || (collection.category && selectedCategories.has(collection.category as FilterCategory))
      const matchesPriceRange = selectedPriceRanges.size === 0 || Array.from(selectedPriceRanges).some(range => isPriceInRange(collection.floorPrice, range))

      return matchesSearch && matchesCategory && matchesPriceRange
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return parseFloat(b.floorPrice) - parseFloat(a.floorPrice)
        case 'price-low':
          return parseFloat(a.floorPrice) - parseFloat(b.floorPrice)
        case 'oldest':
          return a.id - b.id
        case 'popularity':
          return b.totalItems - a.totalItems
        default: // newest
          return b.id - a.id
      }
    })

  const totalPages = Math.ceil(filteredCollections.length / collectionsPerPage)
  const currentCollections = filteredCollections.slice((currentPage - 1) * collectionsPerPage, currentPage * collectionsPerPage)

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true)
      try {
        const apiCollections = await collectionsService.getAllCollections()

        const mappedCollections = apiCollections.map(collection => ({
          id: collection.attributes.id,
          name: collection.attributes.name,
          description: 'Collection from Ultra Times ecosystem',
          image: collection.attributes.image || '',
          artist: 'Ultra Times',
          totalItems: 1000,
          floorPrice: '0.5',
          category: collection.attributes.is_trending ? 'game-assets' : collection.attributes.is_featured ? 'art' : 'collectibles',
        }))

        setCollections(mappedCollections)
        setError(null)
      } catch (error) {
        console.error('Error fetching collections:', error)
        setError('Failed to load collections. Please try again later.')
        setCollections(generateMockCollections(4))
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    })
  }

  const handleCategoryToggle = (category: FilterCategory) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const handlePriceRangeToggle = (range: PriceRange) => {
    setSelectedPriceRanges(prev => {
      const newSet = new Set(prev)
      if (newSet.has(range)) {
        newSet.delete(range)
      } else {
        newSet.add(range)
      }
      return newSet
    })
  }

  const handleClearFilters = () => {
    setSelectedCategories(new Set())
    setSelectedPriceRanges(new Set())
    setSortBy('newest')
    setSearchQuery('')
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin'></div>
          <p className='mt-4 text-xl'>Loading collections...</p>
        </div>
      </div>
    )
  }

  if (error && collections.length === 0) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-500 mb-4'>Error</h2>
          <p className='text-gray-300'>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white'>
      {/* Banner */}
      <div className='relative h-80 w-full'>
        <img src='https://picsum.photos/1920/600?random=5' alt='Collections Banner' className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center'>
          <h1 className='text-5xl font-cabin font-bold mb-4 text-primary-300'>NFT Collections</h1>
          <p className='text-xl max-w-2xl text-center font-quicksand'>Explore our exclusive digital art collections created by world-renowned artists</p>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        {/* Filter Bar */}
        <div className='mb-8'>
          <FilterBar selectedCategories={selectedCategories} selectedPriceRanges={selectedPriceRanges} sortBy={sortBy} searchQuery={searchQuery} onCategoryToggle={handleCategoryToggle} onPriceRangeToggle={handlePriceRangeToggle} onSortChange={sort => setSortBy(sort as SortOption)} onSearchChange={setSearchQuery} onClearFilters={handleClearFilters} />
        </div>

        {/* Collections Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {currentCollections.map(collection => (
            <CollectionCard key={collection.id} id={collection.id} name={collection.name} description={collection.description} category={collection.category} image={collection.image} artist={collection.artist} totalItems={collection.totalItems} floorPrice={collection.floorPrice} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center mt-12'>
            <div className='flex space-x-2'>
              <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-dark-700 text-gray-500 cursor-not-allowed' : 'bg-dark-800 text-white hover:bg-primary-600 transition-colors'}`}>
                Previous
              </button>

              {Array.from({length: totalPages}, (_, i) => i + 1).map(number => (
                <button key={number} onClick={() => handlePageChange(number)} className={`px-4 py-2 rounded-lg ${currentPage === number ? 'bg-primary-600 text-white' : 'bg-dark-800 text-white hover:bg-primary-600 transition-colors'}`}>
                  {number}
                </button>
              ))}

              <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-dark-700 text-gray-500 cursor-not-allowed' : 'bg-dark-800 text-white hover:bg-primary-600 transition-colors'}`}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionsPage