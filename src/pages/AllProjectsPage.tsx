import { ContactFooter } from '../components/ContactFooter'
import { getLocalizedProject, projects } from '../data/projects'
import { useLanguage } from '../i18n'
import { useReveal } from '../hooks/useReveal'
import { preloadProjectAssets } from '../lib/preloadAssets'
import { AppLink } from '../router'
import { LazyVideo } from '../components/LazyVideo'

const catalogueProjects = [
  ...projects.filter((project) => project.slug === 'aurelia'),
  ...projects.filter((project) => project.slug !== 'aurelia'),
]

const projectThumbnail = (source: string) => source
  .replace('/assets/projects/', '/assets/project-slider/')
  .replace(/\.png$/, '.webp')

export function AllProjectsPage() {
  const { language, t } = useLanguage()
  useReveal()

  return (
    <main className="all-projects-page">
      <section className="all-projects-catalogue" data-header-theme="light">
        <header className="all-projects-heading" data-reveal>
          <div>
            <p>( {t.projects.all} )</p>
            <AppLink className="all-projects-back" to="/#work">← {t.projects.backHome}</AppLink>
          </div>
          <h1>{t.projects.heading}</h1>
          <p className="all-projects-intro">
            {t.projects.intro}
          </p>
        </header>

        <div className="all-projects-grid">
          {catalogueProjects.map((project, index) => {
            const projectCopy = getLocalizedProject(project, language)
            const warmProject = () => preloadProjectAssets(project)
            const thumbnail = project.slug === 'aurelia'
              ? project.homeImages[0]
              : projectThumbnail(project.homeImages[0])
            return (
            <article
              className={`all-project-card${project.previewVideo ? ' all-project-card--video' : ''}`}
              data-reveal
              style={{ '--reveal-delay': `${Math.min(index, 3) * 70}ms` } as React.CSSProperties}
              key={project.slug}
            >
              <AppLink
                to={`/work/${project.slug}`}
                state={{ projectOrigin: 'all-projects' }}
                aria-label={`${t.projects.openProject} ${project.title}`}
                onPointerEnter={warmProject}
                onPointerDown={warmProject}
                onFocus={warmProject}
              >
                <div className="all-project-media">
                  {project.previewVideo ? (
                    <LazyVideo
                      src={project.previewVideo}
                      poster={thumbnail}
                      ariaLabel={`${project.title} — ${t.projects.videoPreview}`}
                    />
                  ) : (
                    <img
                      src={thumbnail}
                      alt={`${project.title} — ${t.projects.preview}`}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      fetchPriority={index < 2 ? 'high' : 'low'}
                      decoding="async"
                    />
                  )}
                  <span className="all-project-open" aria-hidden="true">↗</span>
                  {project.previewVideo && <span className="all-project-video-tag">VIDEO</span>}
                </div>
                <div className="all-project-caption">
                  <h2>{project.title}</h2>
                  <p>{projectCopy.category}</p>
                  <span>{project.year}</span>
                </div>
              </AppLink>
            </article>
            )
          })}
        </div>
      </section>
      <ContactFooter />
    </main>
  )
}
