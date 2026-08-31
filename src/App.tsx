import { useEffect } from 'react'
import { PageTransition } from './components/PageTransition'
import { SiteHeader } from './components/SiteHeader'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { AllProjectsPage } from './pages/AllProjectsPage'
import { AboutPage } from './pages/AboutPage'
import { HomePage } from './pages/HomePage'
import { useRouter } from './router'

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
      {page}
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
