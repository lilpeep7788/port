import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../i18n'

type ImageLightboxProps = {
  images: string[]
  activeIndex: number | null
  title: string
  onClose: () => void
  onChange: (index: number) => void
}

export function ImageLightbox({ images, activeIndex, title, onClose, onChange }: ImageLightboxProps) {
  const { t } = useLanguage()
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

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${t.case.gallery} ${title}`} onClick={onClose}>
      <button type="button" className="lightbox-close" onClick={onClose} aria-label={t.case.closeGallery}>{t.case.closeGallery} ×</button>
      <button
        type="button"
        className="lightbox-arrow lightbox-prev"
        onClick={(event) => { event.stopPropagation(); onChange((activeIndex - 1 + images.length) % images.length) }}
        aria-label={t.case.previous}
      >
        ←
      </button>
      <div className="lightbox-image-frame" onClick={(event) => event.stopPropagation()}>
        <img
          src={images[activeIndex]}
          alt={`${title} — ${t.projects.preview}, ${activeIndex + 1}`}
        />
      </div>
      <button
        type="button"
        className="lightbox-arrow lightbox-next"
        onClick={(event) => { event.stopPropagation(); onChange((activeIndex + 1) % images.length) }}
        aria-label={t.case.next}
      >
        →
      </button>
      <span className="lightbox-count">{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
    </div>,
    document.body,
  )
}
