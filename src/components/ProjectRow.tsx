import type { Project } from '../data/projects'

type ProjectRowProps = {
  project: Project
  image: string
  imageIndex: number
}

export function ProjectRow({ project, image, imageIndex }: ProjectRowProps) {
  return (
    <div
      className={`project-row project-${project.slug} w-[90vw] shrink-0 sm:w-[80vw] md:w-[70vw] lg:w-[clamp(640px,48vw,880px)]`}
      aria-hidden="true"
    >
      <div className="project-images relative aspect-[16/10] w-full overflow-hidden rounded-[24px]">
        <div className="project-image-frame" style={{ '--stagger': '0ms' } as React.CSSProperties}>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            width="1200"
            height="750"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            data-image-index={imageIndex}
          />
        </div>
      </div>
    </div>
  )
}
