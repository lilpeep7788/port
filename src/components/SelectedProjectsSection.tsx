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

  const warmAllProjects = () => preloadProjectsIndexAssets(projects, 'high')

  return (
    <section className="selected-projects" id="work" data-header-theme="light">
      <div className="section-kicker-row">
        <span>( {t.projects.featured} )</span>
        <AppLink
          className="all-projects-link"
          to="/work"
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') warmAllProjects()
          }}
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
                onPointerEnter={(event) => {
                  if (event.pointerType === 'mouse') warmProject()
                }}
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
