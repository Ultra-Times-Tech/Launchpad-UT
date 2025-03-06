import {useState, useEffect} from 'react'
import CollectionCard from '../Card/CollectionCard'

interface TrendingCollection {
  id: number
  name: string
  description: string
  image: string
  artist: string
  totalItems: number
  floorPrice: string
}

interface TrendingCollectionsProps {
  collections: TrendingCollection[]
}

function TrendingCollections({collections}: TrendingCollectionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(current => (current + 1) % (collections.length - 3))
    }, 7000)

    return () => clearInterval(interval)
  }, [collections.length])

  const nextSlide = () => {
    setCurrentIndex(current => (current + 1) % (collections.length - 3))
  }

  const prevSlide = () => {
    setCurrentIndex(current => (current - 1 + (collections.length - 3)) % (collections.length - 3))
  }

  return (
    <div className='bg-dark-900 py-16'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center mb-12'>
          <h2 className='text-2xl font-cabin font-bold text-primary-300'>Trending Collections</h2>
        </div>

        <div className='relative overflow-hidden group'>
          <button onClick={prevSlide} className='absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-dark-800 bg-opacity-80 hover:bg-opacity-100 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-sm'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
          </button>

          <button onClick={nextSlide} className='absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-dark-800 bg-opacity-80 hover:bg-opacity-100 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-sm'>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>

          <div className='flex transition-transform duration-700 ease-out' style={{transform: `translateX(-${currentIndex * 25}%)`}}>
            {[...collections, ...collections].map((collection, index) => (
              <div key={`${collection.id}-${index}`} className='w-1/4 flex-shrink-0 px-3'>
                <div className='collection-hover'>
                  <CollectionCard {...collection} />
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-center mt-8 space-x-2'>
            {Array.from({length: collections.length - 3}).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-primary-500 w-4' : 'bg-dark-700 hover:bg-dark-600'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingCollections