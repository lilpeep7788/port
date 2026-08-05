import type { ReactNode } from 'react'

export function PageTransition({ children, pageKey }: { children: ReactNode; pageKey: string }) {
  return (
    <div className="page-transition" key={pageKey}>
      {children}
    </div>
  )
}
