import { useEffect } from 'react'
import { CaseGallery } from '../components/CaseGallery'
import { ContactFooter } from '../components/ContactFooter'
import { getProject } from '../data/projects'
import { useReveal } from '../hooks/useReveal'
import { AppLink, useRouter } from '../router'

export function CaseStudyPage({ slug }: { slug?: string }) {
  const { navigate } = useRouter()
  const project = getProject(slug)
  useReveal()

  useEffect(() => {
    if (!project) navigate('/', true)
  }, [navigate, project])

  if (!project) return null

  return (
    <main className={`case-page case-${project.theme}`}>
      <section className="case-layout" data-header-theme={project.theme === 'dark' ? 'dark' : 'light'}>
        <aside className="case-info">
          <div className="case-title-row">
            <h1>{project.title}</h1>
            <AppLink to="/#work">↵&nbsp;&nbsp;Back</AppLink>
          </div>
          <div className="case-description">
            <span>Info</span>
            <p>{project.summary}</p>
          </div>
          <dl className="case-meta">
            <div className="wide"><dt>Areas</dt><dd>{project.category}</dd></div>
            <div><dt>Client</dt><dd>{project.title}</dd></div>
            <div><dt>Year</dt><dd>{project.year}</dd></div>
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Scope</dt><dd>{project.scope}</dd></div>
            <div className="wide"><dt>Deliverables</dt><dd>{project.deliverables}</dd></div>
          </dl>
        </aside>
        <CaseGallery project={project} />
      </section>
      <ContactFooter />
    </main>
  )
}
