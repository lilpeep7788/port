import type { CSSProperties, ReactNode } from 'react'

type InfiniteSliderProps = {
  children: ReactNode
  gap?: number
  duration?: number
  durationOnHover?: number
  direction?: 'horizontal' | 'vertical'
  reverse?: boolean
  className?: string
  ariaHidden?: boolean
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
  ariaHidden = false,
}: InfiniteSliderProps) {
  const style = {
    '--slider-gap': `${gap}px`,
    '--slider-duration': `${duration}s`,
    '--slider-hover-duration': `${durationOnHover ?? duration}s`,
  } as CSSProperties

  return (
    <div
      className={`infinite-slider${className ? ` ${className}` : ''}`}
      aria-hidden={ariaHidden || undefined}
      data-direction={direction}
      data-reverse={reverse || undefined}
      style={style}
    >
      <div className="infinite-slider-track">
        <div className="infinite-slider-sequence">{children}</div>
        <div className="infinite-slider-sequence" aria-hidden="true">{children}</div>
      </div>
    </div>
  )
}
