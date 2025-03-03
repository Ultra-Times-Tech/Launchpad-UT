import {useState, useEffect, useCallback} from 'react'
import {SLIDER_INTERVAL} from '../../constants'

interface HeroSlideProps {
  title: string
  description: string
  buttonText: string
  onButtonClick?: () => void
}

const Slider: React.FC<HeroSlideProps> = ({title, description, buttonText, onButtonClick}) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Random images for the slider
  const slides = ['https://picsum.photos/1920/600?random=1', 'https://picsum.photos/1920/600?random=2', 'https://picsum.photos/1920/600?random=3', 'https://picsum.photos/1920/600?random=4', 'https://picsum.photos/1920/600?random=5']

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const goToNextSlide = useCallback(() => {
    const nextSlide = (currentSlide + 1) % slides.length
    goToSlide(nextSlide)
  }, [currentSlide, slides.length, goToSlide])

  const goToPrevSlide = useCallback(() => {
    const prevSlide = (currentSlide - 1 + slides.length) % slides.length
    goToSlide(prevSlide)
  }, [currentSlide, slides.length, goToSlide])

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(goToNextSlide, SLIDER_INTERVAL)
    return () => clearInterval(interval)
  }, [goToNextSlide])

  return (
    <div className='relative h-[500px] overflow-hidden'>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <img src={slide} alt={`Slide ${index + 1}`} className='w-full h-full object-cover' />
          <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center'>
            <h1 className='text-4xl md:text-5xl font-cabin font-bold mb-4 text-primary-300'>{title}</h1>
            <p className='text-lg md:text-xl mb-8 max-w-3xl mx-auto font-quicksand text-center'>{description}</p>
            <button onClick={onButtonClick} className='bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-full transition duration-300'>
              {buttonText}
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button onClick={goToPrevSlide} className='absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300' aria-label='Previous slide'>
        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
        </svg>
      </button>
      <button onClick={goToNextSlide} className='absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300' aria-label='Next slide'>
        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2'>
        {slides.map((_, index) => (
          <button key={index} onClick={() => goToSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-primary-500 w-6' : 'bg-white bg-opacity-50 hover:bg-opacity-70'}`} aria-label={`Go to slide ${index + 1}`} />
        ))}
      </div>
    </div>
  )
}

export default Slider