import { useCallback, useState } from 'react'
import type { Project } from '../data/projects'
import { ImageLightbox } from './ImageLightbox'
import { useLanguage } from '../i18n'
import { LazyVideo } from './LazyVideo'

export function CaseGallery({ project }: { project: Project }) {
  const { t } = useLanguage()
  const images = project.previewVideo ? project.caseImages.slice(1) : project.caseImages.slice(0, 6)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const close = useCallback(() => setActiveIndex(null), [])
  const change = useCallback((index: number) => setActiveIndex(index), [])

  return (
    <>
      <div className="case-gallery">
        {project.previewVideo && (
          <div className="case-video-frame" data-reveal>
            <LazyVideo
              src={project.previewVideo}
              poster={project.homeImages[0]}
              ariaLabel={`${project.title} — ${t.case.demo}`}
            />
            <span className="case-video-label">{t.case.videoPreview}</span>
          </div>
        )}
        {images.map((src, index) => (
          <button
            className="case-image-button"
            type="button"
            key={src}
            onClick={() => setActiveIndex(index)}
            data-reveal
            style={{ '--reveal-delay': `${Math.min(index, 3) * 55}ms` } as React.CSSProperties}
            aria-label={`${t.case.openFrame} ${index + 1} — ${project.title}`}
          >
            <img
              src={src}
              alt={`${project.title} — ${t.projects.preview}, ${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
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
