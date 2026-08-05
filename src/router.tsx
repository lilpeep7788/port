import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'

type RouterValue = {
  location: string
  navigate: (to: string, replace?: boolean) => void
}

const RouterContext = createContext<RouterValue | null>(null)

const currentLocation = () => `${window.location.pathname}${window.location.search}${window.location.hash}`

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(currentLocation)

  useEffect(() => {
    const onPopState = () => setLocation(currentLocation())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback((to: string, replace = false) => {
    const url = new URL(to, window.location.href)
    const next = `${url.pathname}${url.search}${url.hash}`
    if (replace) window.history.replaceState({}, '', next)
    else window.history.pushState({}, '', next)
    setLocation(next)
  }, [])

  const value = useMemo(() => ({ location, navigate }), [location, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const router = useContext(RouterContext)
  if (!router) throw new Error('useRouter must be used inside RouterProvider')
  return router
}

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

export function AppLink({ to, onClick, ...props }: AppLinkProps) {
  const { navigate } = useRouter()
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handleClick} {...props} />
}
