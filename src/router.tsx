import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

type RouterValue = {
  location: string
  state: NavigationState
  navigate: (to: string, replace?: boolean, state?: NavigationState) => void
}

export type NavigationState = {
  projectOrigin?: 'home' | 'all-projects'
} | null

const RouterContext = createContext<RouterValue | null>(null)

const currentLocation = () => `${window.location.pathname}${window.location.search}${window.location.hash}`

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(currentLocation)
  const [state, setState] = useState<NavigationState>(() => window.history.state)

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const onPopState = () => {
      setLocation(currentLocation())
      setState(window.history.state)
    }
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  const navigate = useCallback((to: string, replace = false, nextState: NavigationState = null) => {
    const url = new URL(to, window.location.href)
    const next = `${url.pathname}${url.search}${url.hash}`
    window.scrollTo(0, 0)
    if (replace) window.history.replaceState(nextState, '', next)
    else window.history.pushState(nextState, '', next)
    setLocation(next)
    setState(nextState)
  }, [])

  const value = useMemo(() => ({ location, state, navigate }), [location, navigate, state])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const router = useContext(RouterContext)
  if (!router) throw new Error('useRouter must be used inside RouterProvider')
  return router
}

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  state?: NavigationState
}

export function AppLink({ to, state, onClick, ...props }: AppLinkProps) {
  const { navigate } = useRouter()
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to, false, state)
  }
  return <a href={to} onClick={handleClick} {...props} />
}
