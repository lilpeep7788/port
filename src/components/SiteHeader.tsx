import { useEffect, useState } from 'react'
import { AppLink, useRouter } from '../router'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { location } = useRouter()

  useEffect(() => setMenuOpen(false), [location])

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [menuOpen])

  const goTo = (id: string) => () => {
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <>
      <header className="site-header">
        <AppLink to="/" className="brand" aria-label="DEGRA home">
          <span>DEGRA®</span>
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-role">Digital Creator</span>
        </AppLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <AppLink to="/#work" onClick={goTo('work')}>Work</AppLink>
          <AppLink to="/#about" onClick={goTo('about')}>About</AppLink>
        </nav>
        <a className="header-cta" href="mailto:hello@degra.design">
          <span aria-hidden="true">↗</span>
          <span>Let’s talk</span>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>
      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <AppLink to="/#work" onClick={goTo('work')}>Work</AppLink>
        <AppLink to="/#about" onClick={goTo('about')}>About</AppLink>
        <a href="mailto:hello@degra.design">Let’s talk ↗</a>
      </div>
    </>
  )
}
