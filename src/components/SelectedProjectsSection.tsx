import { useEffect } from 'react'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { projects } from '../data/projects'
import { preloadProjectAssets, preloadProjectsIndexAssets } from '../lib/preloadAssets'
import { AppLink } from '../router'
import { ProjectRow } from './ProjectRow'
import { useLanguage } from '../i18n'

const sliderImage = (source: string) => source
  .replace('/assets/projects/', '/assets/project-slider/')
  .replace(/\.png$/, '.webp')

export function SelectedProjectsSection() {
  const { t } = useLanguage()
  const featuredProjects = projects.filter((project) => project.featured)

  useEffect(() => {
    let idleCallback = 0
    let fallbackTimer = 0

    const warmProjectsIndex = () => {
      const requestIdle = Reflect.get(window, 'requestIdleCallback') as typeof window.requestIdleCallback | undefined
      if (requestIdle) {
        idleCallback = requestIdle.call(
          window,
          () => preloadProjectsIndexAssets(projects),
          { timeout: 3000 },
        )
      } else {
        fallbackTimer = window.setTimeout(() => preloadProjectsIndexAssets(projects), 600)
      }
    }

    if (document.readyState === 'complete') warmProjectsIndex()
    else window.addEventListener('load', warmProjectsIndex, { once: true })

    return () => {
      window.removeEventListener('load', warmProjectsIndex)
      const cancelIdle = Reflect.get(window, 'cancelIdleCallback') as typeof window.cancelIdleCallback | undefined
      if (idleCallback && cancelIdle) cancelIdle.call(window, idleCallback)
      if (fallbackTimer) window.clearTimeout(fallbackTimer)
    }
  }, [])

  const warmAllProjects = () => preloadProjectsIndexAssets(projects, 'high')

  return (
    <section className="selected-projects" id="work" data-header-theme="light">
      <div className="section-kicker-row">
        <span>( {t.projects.featured} )</span>
        <AppLink
          className="all-projects-link"
          to="/work"
          onPointerEnter={warmAllProjects}
          onPointerDown={warmAllProjects}
          onFocus={warmAllProjects}
        >
          <span>{t.projects.all}</span>
          <span className="all-projects-link-arrow" aria-hidden="true">↗</span>
        </AppLink>
      </div>
      <div className="section-rule" />
      <div id="work-list" className="project-list">
        {featuredProjects.map((project) => {
          const titleId = `featured-project-${project.slug}`
          const warmProject = () => preloadProjectAssets(project)
          return (
            <article className="project-slider-row" key={project.slug}>
              <h3 className="project-slider-title" id={titleId}>{project.title}</h3>
              <AppLink
                className="project-link project-slider-link"
                to={`/work/${project.slug}`}
                state={{ projectOrigin: 'home' }}
                aria-labelledby={titleId}
                aria-label={`${t.projects.openCase} ${project.title}`}
                onPointerEnter={warmProject}
                onPointerDown={warmProject}
                onFocus={warmProject}
              >
                <InfiniteSlider
                  duration={project.caseImages.length * 10}
                  durationOnHover={project.caseImages.length * 25}
                  gap={24}
                  className="projects-slider"
                  ariaHidden
                >
                  {project.caseImages.map((image, index) => (
                    <ProjectRow
                      project={project}
                      image={sliderImage(image)}
                      imageIndex={index}
                      key={image}
                    />
                  ))}
                </InfiniteSlider>
              </AppLink>
            </article>
          )
        })}
      </div>
    </section>
  )
}
