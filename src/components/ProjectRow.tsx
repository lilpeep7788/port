import type { Project } from '../data/projects'
import { AppLink } from '../router'

export function ProjectRow({ project }: { project: Project }) {
  return (
    <article className={`project-row project-${project.slug}`} data-reveal>
      <AppLink className="project-link" to={`/work/${project.slug}`} aria-label={`View ${project.title} case study`}>
        <div className="project-images" style={{ '--columns': project.homeColumns } as React.CSSProperties}>
          {project.homeImages.map((src, index) => (
            <div className="project-image-frame" key={src} style={{ '--stagger': `${index * 70}ms` } as React.CSSProperties}>
              <img
                src={src}
                alt={`${project.title} project presentation ${index + 1}`}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
        <div className="project-caption">
          <h3>{project.title}</h3>
          <p>{project.year} · {project.category}</p>
        </div>
      </AppLink>
    </article>
  )
}
