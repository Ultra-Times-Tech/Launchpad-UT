import {useState, useCallback} from 'react'

interface UseSwipeProps {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  threshold?: number
}

export const useSwipe = ({onSwipeLeft, onSwipeRight, threshold = 50}: UseSwipeProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setTouchStart(clientX)
    setIsDragging(true)
  }, [])

  const handleMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      setTouchEnd(clientX)
    },
    [isDragging]
  )

  const handleEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > threshold
    const isRightSwipe = distance < -threshold

    if (isLeftSwipe) {
      onSwipeLeft()
    }
    if (isRightSwipe) {
      onSwipeRight()
    }

    setTouchStart(null)
    setTouchEnd(null)
    setIsDragging(false)
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
    setTouchStart(null)
    setTouchEnd(null)
  }, [])

  return {
    handleTouchStart: handleStart,
    handleTouchMove: handleMove,
    handleTouchEnd: handleEnd,
    handleMouseDown: handleStart,
    handleMouseMove: handleMove,
    handleMouseUp: handleEnd,
    handleMouseLeave,
    isDragging,
  }
}