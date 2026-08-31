import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter-tight'
import App from './App'
import { LanguageProvider } from './i18n'
import { RouterProvider } from './router'
import './styles.css'

window.history.scrollRestoration = 'manual'

const resetPlainHomeScroll = () => {
  if (window.location.pathname === '/' && !window.location.hash) window.scrollTo(0, 0)
}

resetPlainHomeScroll()
window.addEventListener('pageshow', resetPlainHomeScroll, { once: true })

// Remove the old local-preview deep link before React mounts. Otherwise the
// browser can restore the project-list anchor after the app has already reset
// the scroll position, visually skipping the WHAT I DO scene on refresh.
if (window.location.search.includes('servicesOverlay=') && window.location.hash === '#work-list') {
  window.history.replaceState({}, '', '/')
  window.scrollTo(0, 0)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <RouterProvider>
        <App />
      </RouterProvider>
    </LanguageProvider>
  </StrictMode>,
)
