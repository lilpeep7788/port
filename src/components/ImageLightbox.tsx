import { useEffect } from 'react'

type ImageLightboxProps = {
  images: string[]
  activeIndex: number | null
  title: string
  onClose: () => void
  onChange: (index: number) => void
}

export function ImageLightbox({ images, activeIndex, title, onClose, onChange }: ImageLightboxProps) {
  useEffect(() => {
    if (activeIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onChange((activeIndex + 1) % images.length)
      if (event.key === 'ArrowLeft') onChange((activeIndex - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('lightbox-open')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('lightbox-open')
    }
  }, [activeIndex, images.length, onChange, onClose])

  if (activeIndex === null) return null

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} image viewer`} onClick={onClose}>
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close image viewer">Close ×</button>
      <button
        type="button"
        className="lightbox-arrow lightbox-prev"
        onClick={(event) => { event.stopPropagation(); onChange((activeIndex - 1 + images.length) % images.length) }}
        aria-label="Previous image"
      >
        ←
      </button>
      <img
        src={images[activeIndex]}
        alt={`${title} project presentation ${activeIndex + 1}`}
        onClick={(event) => event.stopPropagation()}
      />
      <button
        type="button"
        className="lightbox-arrow lightbox-next"
        onClick={(event) => { event.stopPropagation(); onChange((activeIndex + 1) % images.length) }}
        aria-label="Next image"
      >
        →
      </button>
      <span className="lightbox-count">{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
    </div>
  )
}
