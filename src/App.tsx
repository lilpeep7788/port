import { lazy, Suspense, useEffect } from 'react'
import { PageTransition } from './components/PageTransition'
import { SiteHeader } from './components/SiteHeader'
import { HomePage } from './pages/HomePage'
import { useRouter } from './router'

const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage').then((module) => ({ default: module.CaseStudyPage })))
const AllProjectsPage = lazy(() => import('./pages/AllProjectsPage').then((module) => ({ default: module.AllProjectsPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })))

function AppRouter() {
  const { location } = useRouter()
  const [pathname, hash = ''] = location.split('#')

  useEffect(() => {
    const target = hash
    window.scrollTo(0, 0)

    const frame = requestAnimationFrame(() => {
      if (target) document.getElementById(target)?.scrollIntoView()
      else window.scrollTo(0, 0)
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  const isProjectsIndex = pathname === '/work' || pathname === '/work/'
  const isAbout = pathname === '/about' || pathname === '/about/'
  const slug = pathname.startsWith('/work/') ? pathname.slice('/work/'.length) : undefined
  const page = isAbout ? <AboutPage /> : isProjectsIndex ? <AllProjectsPage /> : slug ? <CaseStudyPage slug={slug} /> : <HomePage />

  return (
    <PageTransition pageKey={pathname} key={pathname}>
      <Suspense fallback={<main className="route-loading" aria-busy="true" aria-label="Загрузка страницы" />}>
        {page}
      </Suspense>
    </PageTransition>
  )
}

export default function App() {
  return (
    <>
      <SiteHeader />
      <AppRouter />
    </>
  )
}
