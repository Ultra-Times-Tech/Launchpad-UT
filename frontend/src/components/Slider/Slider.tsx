import {SLIDER_INTERVAL} from '../../constants'
import {useSlider} from '../../hooks/useSlider'

interface HeroSlideProps {
  title: string
  description: string
  buttonText: string
  onButtonClick?: () => void
}

const Slider: React.FC<HeroSlideProps> = ({title, description, buttonText, onButtonClick}) => {
  // Random images for the slider
  const slides = ['https://picsum.photos/1920/600?random=1', 'https://picsum.photos/1920/600?random=2', 'https://picsum.photos/1920/600?random=3', 'https://picsum.photos/1920/600?random=4', 'https://picsum.photos/1920/600?random=5']

  const {
    currentIndex: currentSlide,
    nextSlide: goToNextSlide,
    prevSlide: goToPrevSlide,
    goToSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    isDragging,
  } = useSlider({
    itemsCount: slides.length,
    slidesPerView: 1,
    autoPlayInterval: SLIDER_INTERVAL,
  })

  return (
    <div className='relative group'>
      <div
        className='relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden select-none'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
        {/* Slides */}
        {slides.map((slide, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out select-none ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
            <img src={slide} alt={`Slide ${index + 1}`} className='w-full h-full object-cover select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', pointerEvents: 'none'}} />
            <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center px-4 select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
              <h1 className='text-2xl sm:text-3xl lg:text-5xl font-cabin font-bold mb-2 sm:mb-4 text-primary-300 text-center select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
                {title}
              </h1>
              <p className='text-base sm:text-lg lg:text-xl mb-4 sm:mb-8 max-w-3xl mx-auto font-quicksand text-center select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
                {description}
              </p>
              <button onClick={onButtonClick} className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full transition duration-300 select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
                {buttonText}
              </button>
            </div>
          </div>
        ))}

        {/* Navigation Arrows - Hidden on mobile, visible on hover */}
        <button
          onClick={goToPrevSlide}
          className='hidden sm:block absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 select-none opacity-0 group-hover:opacity-100'
          style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}
          aria-label='Previous slide'>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 sm:h-6 sm:w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
        </button>
        <button
          onClick={goToNextSlide}
          className='hidden sm:block absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 select-none opacity-0 group-hover:opacity-100'
          style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}
          aria-label='Next slide'>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 sm:h-6 sm:w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 select-none' style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
          {slides.map((_, index) => (
            <button key={index} onClick={() => goToSlide(index)} className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-primary-500 w-4 sm:w-6' : 'bg-white bg-opacity-50 hover:bg-opacity-70'} select-none`} style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Slider