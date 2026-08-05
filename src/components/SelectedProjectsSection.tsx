import { projects } from '../data/projects'
import { ProjectRow } from './ProjectRow'

export function SelectedProjectsSection() {
  return (
    <section className="selected-projects" id="work" data-header-theme="light">
      <div className="section-kicker-row">
        <span>( Selected projects )</span>
        <a href="#work-list">↳&nbsp;&nbsp;View all projects</a>
      </div>
      <div className="section-rule" />
      <div id="work-list" className="project-list">
        {projects.map((project) => <ProjectRow project={project} key={project.slug} />)}
      </div>
    </section>
  )
}
