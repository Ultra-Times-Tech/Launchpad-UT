import {useState, useEffect, useCallback, useRef} from 'react'
import {useSwipe} from './useSwipe'

interface UseSliderProps {
  itemsCount: number
  slidesPerView: number
  autoPlayInterval?: number
}

export const useSlider = ({itemsCount, slidesPerView, autoPlayInterval = 7000}: UseSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentSlidesPerView, setCurrentSlidesPerView] = useState(slidesPerView)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setCurrentSlidesPerView(1)
      } else if (width < 1024) {
        setCurrentSlidesPerView(2)
      } else if (width < 1280) {
        setCurrentSlidesPerView(3)
      } else {
        setCurrentSlidesPerView(slidesPerView)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [slidesPerView])

  // Auto-play avec réinitialisation du timer
  const startAutoPlay = useCallback(() => {
    if (!autoPlayInterval) return

    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Start new timer
    timerRef.current = setInterval(() => {
      setCurrentIndex(current => (current + 1) % (itemsCount - (currentSlidesPerView - 1)))
    }, autoPlayInterval)
  }, [itemsCount, currentSlidesPerView, autoPlayInterval])

  useEffect(() => {
    startAutoPlay()
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [startAutoPlay])

  const nextSlide = useCallback(() => {
    setCurrentIndex(current => (current + 1) % (itemsCount - (currentSlidesPerView - 1)))
    startAutoPlay() // Réinitialise le timer
  }, [itemsCount, currentSlidesPerView, startAutoPlay])

  const prevSlide = useCallback(() => {
    setCurrentIndex(current => (current - 1 + (itemsCount - (currentSlidesPerView - 1))) % (itemsCount - (currentSlidesPerView - 1)))
    startAutoPlay() // Réinitialise le timer
  }, [itemsCount, currentSlidesPerView, startAutoPlay])

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index)
      startAutoPlay() // Réinitialise le timer
    },
    [startAutoPlay]
  )

  const {handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, isDragging} = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
  })

  const slideWidth = 100 / currentSlidesPerView

  return {
    currentIndex,
    currentSlidesPerView,
    slideWidth,
    nextSlide,
    prevSlide,
    goToSlide,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    isDragging,
  }
}