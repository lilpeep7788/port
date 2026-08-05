import { useCallback, useState } from 'react'
import type { Project } from '../data/projects'
import { ImageLightbox } from './ImageLightbox'

export function CaseGallery({ project }: { project: Project }) {
  const images = project.caseImages.slice(0, 6)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const close = useCallback(() => setActiveIndex(null), [])
  const change = useCallback((index: number) => setActiveIndex(index), [])

  return (
    <>
      <div className="case-gallery">
        {images.map((src, index) => (
          <button
            className="case-image-button"
            type="button"
            key={src}
            onClick={() => setActiveIndex(index)}
            data-reveal
            style={{ '--reveal-delay': `${Math.min(index, 3) * 55}ms` } as React.CSSProperties}
            aria-label={`Open ${project.title} presentation image ${index + 1}`}
          >
            <img
              src={src}
              alt={`${project.title} website presentation ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </button>
        ))}
      </div>
      <ImageLightbox
        images={images}
        activeIndex={activeIndex}
        title={project.title}
        onClose={close}
        onChange={change}
      />
    </>
  )
}
