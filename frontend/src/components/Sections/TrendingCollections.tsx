import CollectionCard from '../Card/CollectionCard'
import {useSlider} from '../../hooks/useSlider'

interface TrendingCollection {
  id: number
  name: string
  description: string
  image: string
  artist: string
  totalItems: number
  floorPrice: string
  category: string
}

interface TrendingCollectionsProps {
  collections: TrendingCollection[]
}

function TrendingCollections({collections}: TrendingCollectionsProps) {
  const {currentIndex, currentSlidesPerView, slideWidth, nextSlide, prevSlide, goToSlide, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, isDragging} = useSlider({
    itemsCount: collections.length,
    slidesPerView: 4,
  })

  return (
    <div className='bg-dark-900 py-16'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center mb-12'>
          <h2 className='text-2xl font-cabin font-bold text-primary-300'>Trending Collections</h2>
        </div>

        <div
          className='relative overflow-hidden group select-none'
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
          <button onClick={prevSlide} className='absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-dark-800 bg-opacity-80 hover:bg-opacity-100 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-sm select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
          </button>

          <button onClick={nextSlide} className='absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-dark-800 bg-opacity-80 hover:bg-opacity-100 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-sm select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
            <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>

          <div className='flex transition-transform duration-700 ease-out select-none' style={{transform: `translateX(-${currentIndex * slideWidth}%)`, userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
            {[...collections, ...collections].map((collection, index) => (
              <div key={`${collection.id}-${index}`} style={{width: `${slideWidth}%`, userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}} className='flex-shrink-0 px-3 select-none'>
                <div className='collection-hover select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
                  <CollectionCard {...collection} />
                </div>
              </div>
            ))}
          </div>

          <div className='flex justify-center mt-8 space-x-2 select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
            {Array.from({length: collections.length - (currentSlidesPerView - 1)}).map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-primary-500 w-4' : 'bg-dark-700 hover:bg-dark-600'} select-none`} style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}} aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingCollections