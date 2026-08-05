import { useEffect } from 'react'
import { PageTransition } from './components/PageTransition'
import { SiteHeader } from './components/SiteHeader'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { HomePage } from './pages/HomePage'
import { useRouter } from './router'

function AppRouter() {
  const { location } = useRouter()
  const [pathname, hash = ''] = location.split('#')

  useEffect(() => {
    const target = hash
    window.scrollTo(0, 0)
    if (target) requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView())
  }, [pathname, hash])

  const slug = pathname.startsWith('/work/') ? pathname.slice('/work/'.length) : undefined
  const page = slug ? <CaseStudyPage slug={slug} /> : <HomePage />

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
