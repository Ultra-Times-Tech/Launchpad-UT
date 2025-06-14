import {useState, useMemo, useEffect} from 'react'
import CollectionCard from '../components/Card/CollectionCard'
import FilterBar, {FilterCategory, SortOption, PriceRange} from '../components/FilterBar/FilterBar'
import {useTranslation} from '../hooks/useTranslation'
import {useCollections} from '../hooks/useCollections'
import AOS from 'aos'
import 'aos/dist/aos.css'

function CollectionsPage() {
  const {t} = useTranslation()
  const {allCollections, loading, error} = useCollections()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState<Set<FilterCategory>>(new Set())
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<Set<PriceRange>>(new Set())
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 0
    });
  }, []);

  useEffect(() => {
    if (!loading && allCollections && allCollections.length > 0) {
      AOS.refresh();
    }
  }, [loading, allCollections]);

  const collectionsPerPage = 9

  // Mapping des collections pour l'affichage
  const mappedCollections = useMemo(() => {
    const result = (allCollections || []).map(collection => ({
      id: collection.attributes.id,
      name: collection.attributes.name,
      description: 'Collection from Ultra Times ecosystem',
      image: collection.attributes.image || '',
      artist: 'Ultra Times',
      totalItems: 1000,
      floorPrice: '0.5',
      category: collection.attributes.is_trending ? 'game-assets' : collection.attributes.is_featured ? 'art' : 'collectibles',
    }))
    return result;
  }, [allCollections])

  // Filtrage et tri
  const filteredCollections = useMemo(() => {
    const result = mappedCollections
      .filter(collection => {
        const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase()) || collection.artist.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategories.size === 0 || (collection.category && selectedCategories.has(collection.category as FilterCategory))
        const matchesPriceRange =
          selectedPriceRanges.size === 0 ||
          Array.from(selectedPriceRanges).some(range => {
            const price = parseFloat(collection.floorPrice)
            if (range === '0-100') return price < 100
            if (range === '100-500') return price >= 100 && price < 500
            if (range === '500-1000') return price >= 500 && price < 1000
            if (range === '1000+') return price >= 1000
            return true
          })
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
    return result;
  }, [mappedCollections, searchQuery, selectedCategories, selectedPriceRanges, sortBy])

  const totalPages = Math.ceil(filteredCollections.length / collectionsPerPage)
  const currentCollections = filteredCollections.slice((currentPage - 1) * collectionsPerPage, currentPage * collectionsPerPage)

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
          <p className='mt-4 text-xl'>{t('loading_collections')}</p>
        </div>
      </div>
    )
  }

  if (error && mappedCollections.length === 0) {
    return (
      <div className='min-h-screen bg-dark-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-500 mb-4'>Error</h2>
          <p className='text-gray-300'>{t('error_loading_collections')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-dark-950 text-white'>
      {/* Banner */}
      <div className='relative h-80 w-full' data-aos="fade-down">
        <img src='https://picsum.photos/1920/600?random=5' alt='Collections Banner' className='w-full h-full object-cover' />
        <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center'>
          <h1 className='text-5xl font-cabin font-bold mb-4 text-primary-300'>{t('collections_title')}</h1>
          <p className='text-xl max-w-2xl text-center font-quicksand'>{t('collections_subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        {/* Filter Bar */}
        <div className='mb-8 relative z-10' data-aos="fade-up">
          <FilterBar selectedCategories={selectedCategories} selectedPriceRanges={selectedPriceRanges} sortBy={sortBy} searchQuery={searchQuery} onCategoryToggle={handleCategoryToggle} onPriceRangeToggle={handlePriceRangeToggle} onSortChange={sort => setSortBy(sort as SortOption)} onSearchChange={setSearchQuery} onClearFilters={handleClearFilters} />
        </div>

        {/* Collections Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {currentCollections.map(collection => (
            <div key={collection.id} data-aos="fade-up">
              <CollectionCard {...collection} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center mt-12' data-aos="fade-up">
            <div className='flex space-x-2'>
              <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-dark-700 text-gray-500 cursor-not-allowed' : 'bg-dark-800 text-white hover:bg-primary-600 transition-colors'}`}>
                {t('previous')}
              </button>

              {Array.from({length: totalPages}, (_, i) => i + 1).map(number => (
                <button key={number} onClick={() => handlePageChange(number)} className={`px-4 py-2 rounded-lg ${currentPage === number ? 'bg-primary-600 text-white' : 'bg-dark-800 text-white hover:bg-primary-600 transition-colors'}`}>
                  {number}
                </button>
              ))}

              <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-dark-700 text-gray-500 cursor-not-allowed' : 'bg-dark-800 text-white hover:bg-primary-600 transition-colors'}`}>
                {t('next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionsPage
