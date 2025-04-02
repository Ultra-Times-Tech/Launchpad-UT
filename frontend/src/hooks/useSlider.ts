import {useState, useEffect, useCallback} from 'react'
import {useSwipe} from './useSwipe'

interface UseSliderProps {
  itemsCount: number
  slidesPerView: number
  autoPlayInterval?: number
}

export const useSlider = ({itemsCount, slidesPerView, autoPlayInterval = 7000}: UseSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentSlidesPerView, setCurrentSlidesPerView] = useState(slidesPerView)

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

  // Auto-play
  useEffect(() => {
    if (!autoPlayInterval) return

    const interval = setInterval(() => {
      setCurrentIndex(current => (current + 1) % (itemsCount - (currentSlidesPerView - 1)))
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [itemsCount, currentSlidesPerView, autoPlayInterval])

  const nextSlide = useCallback(() => {
    setCurrentIndex(current => (current + 1) % (itemsCount - (currentSlidesPerView - 1)))
  }, [itemsCount, currentSlidesPerView])

  const prevSlide = useCallback(() => {
    setCurrentIndex(current => (current - 1 + (itemsCount - (currentSlidesPerView - 1))) % (itemsCount - (currentSlidesPerView - 1)))
  }, [itemsCount, currentSlidesPerView])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

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