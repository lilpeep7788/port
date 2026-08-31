import { useEffect, useRef, useState } from 'react'

type LazyVideoProps = {
  src: string
  poster?: string
  ariaLabel: string
}

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean
  }
}

export function LazyVideo({ src, poster, ariaLabel }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [allowAutoplay] = useState(() => {
    if (typeof window === 'undefined') return false
    const connection = (navigator as NavigatorWithConnection).connection
    return !connection?.saveData && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsNearViewport(true)
      observer.disconnect()
    }, { rootMargin: '300px 0px' })

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={videoRef}
      src={isNearViewport ? src : undefined}
      poster={poster}
      autoPlay={isNearViewport && allowAutoplay}
      controls={!allowAutoplay}
      muted
      loop
      playsInline
      preload="none"
      aria-label={ariaLabel}
    />
  )
}
