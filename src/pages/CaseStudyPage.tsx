import { useEffect } from 'react'
import { CaseGallery } from '../components/CaseGallery'
import { ContactFooter } from '../components/ContactFooter'
import { getLocalizedProject, getProject } from '../data/projects'
import { useLanguage } from '../i18n'
import { useReveal } from '../hooks/useReveal'
import { AppLink, useRouter } from '../router'

export function CaseStudyPage({ slug }: { slug?: string }) {
  const { navigate, state } = useRouter()
  const { language, t } = useLanguage()
  const project = getProject(slug)
  useReveal()

  useEffect(() => {
    if (!project) navigate('/', true)
  }, [navigate, project])

  if (!project) return null
  const projectCopy = getLocalizedProject(project, language)
  const backTarget = state?.projectOrigin === 'all-projects' ? '/work' : '/#work'
  const caseStudyDetails = [
    { label: t.case.challenge, text: projectCopy.caseStudy.challenge },
    { label: t.case.approach, text: projectCopy.caseStudy.approach },
    { label: t.case.caseStudyScope, text: projectCopy.caseStudy.scope },
  ].filter((detail): detail is { label: string; text: string } => Boolean(detail.text))

  return (
    <main className={`case-page case-${project.theme}`}>
      <section className="case-layout" data-header-theme={project.theme === 'dark' ? 'dark' : 'light'}>
        <aside className="case-info">
          <div className="case-title-row">
            <h1>{project.title}</h1>
            <AppLink to={backTarget}>↵&nbsp;&nbsp;{t.case.back}</AppLink>
          </div>
          <div className="case-description">
            <span>{t.case.about}</span>
            <p>{projectCopy.summary}</p>
            <a className="case-live-link" href={project.liveUrl} target="_blank" rel="noreferrer">
              <span>{t.case.openSite}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          {caseStudyDetails.length > 0 && (
            <div className="case-study-details">
              {caseStudyDetails.map((detail) => (
                <section className="case-study-detail" key={detail.label}>
                  <h2>{detail.label}</h2>
                  <p>{detail.text}</p>
                </section>
              ))}
            </div>
          )}
          <dl className="case-meta">
            <div className="wide"><dt>{t.case.direction}</dt><dd>{projectCopy.category}</dd></div>
            <div><dt>{t.case.client}</dt><dd>{project.title}</dd></div>
            <div><dt>{t.case.year}</dt><dd>{project.year}</dd></div>
            <div><dt>{t.case.role}</dt><dd>{projectCopy.role}</dd></div>
            <div><dt>{t.case.scope}</dt><dd>{projectCopy.scope}</dd></div>
            <div className="wide"><dt>{t.case.result}</dt><dd>{projectCopy.deliverables}</dd></div>
          </dl>
        </aside>
        <CaseGallery project={project} />
      </section>
      <ContactFooter />
    </main>
  )
}
