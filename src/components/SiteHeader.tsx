import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AppLink, useRouter } from '../router'
import { useLanguage } from '../i18n'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopDotPosition, setDesktopDotPosition] = useState({ left: 0, top: 0 })
  const desktopAboutRef = useRef<HTMLSpanElement>(null)
  const { location } = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const pathname = location.split(/[?#]/)[0]
  const isAbout = pathname === '/about' || pathname === '/about/'

  useEffect(() => setMenuOpen(false), [location])

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [menuOpen])

  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', menuOpen)
    return () => document.body.classList.remove('mobile-menu-open')
  }, [menuOpen])

  useLayoutEffect(() => {
    const aboutSlot = desktopAboutRef.current
    if (!aboutSlot) return

    const updateDotPosition = () => {
      const dot = aboutSlot.querySelector<HTMLElement>('.about-notification-dot')
      if (!dot) return
      const rect = dot.getBoundingClientRect()
      setDesktopDotPosition({ left: rect.left + rect.width / 2, top: rect.top + rect.height / 2 })
    }

    updateDotPosition()
    const observer = new ResizeObserver(updateDotPosition)
    observer.observe(aboutSlot)
    window.addEventListener('resize', updateDotPosition, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateDotPosition)
    }
  }, [language])

  const goTo = (id: string) => () => {
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <>
      <header className={`site-header ${menuOpen ? 'is-menu-open' : ''}`}>
        <AppLink to="/" className="brand" aria-label={t.header.home}>
          <span>DEGRA®</span>
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-role">{t.header.role}</span>
        </AppLink>
        <nav className="desktop-nav" aria-label={t.header.navigation}>
          <AppLink to="/#work" onClick={goTo('work')}>{t.header.work}</AppLink>
          <span className="desktop-about-slot" ref={desktopAboutRef}>
            <AppLink to="/about" className="about-nav-link" aria-current={isAbout ? 'page' : undefined}>
              <span>{t.header.about}</span>
              <span className="about-notification-dot" aria-hidden="true" />
            </AppLink>
          </span>
        </nav>
        <div className="header-actions">
          <a className="header-cta" href="mailto:degrathink@gmail.com">
            <svg viewBox="0 0 18 18" aria-hidden="true">
              <path d="M4 14 14 4M7 4h7v7" />
            </svg>
            <span>{t.header.contact}</span>
          </a>
          <button
            className="language-switcher"
            type="button"
            aria-label={t.header.switchLanguage}
            onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
          >
            {language === 'ru' ? 'EN' : 'RU'}
          </button>
        </div>
        <button
          className={`menu-button ${menuOpen ? 'is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? t.header.closeMenu : t.header.openMenu}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>
      {!isAbout ? (
        <span
          className="about-notification-dot-overlay"
          aria-hidden="true"
          style={{ left: desktopDotPosition.left, top: desktopDotPosition.top }}
        />
      ) : null}
      <div id="mobile-navigation" className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <nav className="mobile-menu-nav" aria-label={t.header.navigation}>
          <AppLink to="/#work" onClick={goTo('work')}>{t.header.work}</AppLink>
          <AppLink to="/about" className="about-nav-link" aria-current={isAbout ? 'page' : undefined}>
            <span>{t.header.about}</span>
            <span className="about-notification-dot" aria-hidden="true" />
          </AppLink>
        </nav>
        <a className="mobile-menu-contact" href="mailto:degrathink@gmail.com">
          <span>{t.header.contact}</span>
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <path d="M4 14 14 4M7 4h7v7" />
          </svg>
        </a>
      </div>
    </>
  )
}
