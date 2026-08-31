import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLanguage } from '../i18n'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const wordmarkLetters = ['D', 'E', 'G', 'R', 'A']

type OrbitPoint = { x: number; y: number }
type OrbitCurve = [OrbitPoint, OrbitPoint, OrbitPoint]

const primaryOrbitCurves: OrbitCurve[] = [
  [{ x: 628, y: 286 }, { x: 452, y: 543 }, { x: 594, y: 787 }],
  [{ x: 768, y: 1019 }, { x: 1097, y: 1048 }, { x: 1320, y: 769 }],
  [{ x: 1450, y: 606 }, { x: 1428, y: 450 }, { x: 1264, y: 389 }],
]

const secondaryOrbitCurves: OrbitCurve[] = [
  [{ x: 648, y: 297 }, { x: 518, y: 540 }, { x: 674, y: 717 }],
  [{ x: 835, y: 898 }, { x: 1137, y: 881 }, { x: 1300, y: 677 }],
  [{ x: 1385, y: 571 }, { x: 1394, y: 471 }, { x: 1326, y: 411 }],
]

function sampleOrbit(start: OrbitPoint, curves: OrbitCurve[], steps = 6) {
  const points: OrbitPoint[] = []
  let current = start

  curves.forEach(([controlA, controlB, end], curveIndex) => {
    for (let step = curveIndex === 0 ? 0 : 1; step <= steps; step += 1) {
      const t = step / steps
      const inverse = 1 - t
      points.push({
        x: inverse ** 3 * current.x + 3 * inverse ** 2 * t * controlA.x + 3 * inverse * t ** 2 * controlB.x + t ** 3 * end.x,
        y: inverse ** 3 * current.y + 3 * inverse ** 2 * t * controlA.y + 3 * inverse * t ** 2 * controlB.y + t ** 3 * end.y,
      })
    }
    current = end
  })

  return points
}

function orbitPath(points: OrbitPoint[]) {
  if (points.length < 2) return ''
  let path = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)]
    const current = points[index]
    const next = points[index + 1]
    const after = points[Math.min(points.length - 1, index + 2)]
    const controlA = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
    }
    const controlB = {
      x: next.x - (after.x - current.x) / 6,
      y: next.y - (after.y - current.y) / 6,
    }
    path += `C${controlA.x.toFixed(1)} ${controlA.y.toFixed(1)} ${controlB.x.toFixed(1)} ${controlB.y.toFixed(1)} ${next.x.toFixed(1)} ${next.y.toFixed(1)}`
  }

  return path
}

function orbitPointAt(points: OrbitPoint[], progress: number) {
  const scaled = gsap.utils.wrap(0, 1, progress) * (points.length - 1)
  const index = Math.floor(scaled)
  const nextIndex = Math.min(points.length - 1, index + 1)
  const mix = scaled - index
  return {
    x: gsap.utils.interpolate(points[index].x, points[nextIndex].x, mix),
    y: gsap.utils.interpolate(points[index].y, points[nextIndex].y, mix),
  }
}

export function HeroSection() {
  const { t } = useLanguage()
  const heroRef = useRef<HTMLElement>(null)
  const wordSystemRef = useRef<HTMLDivElement>(null)
  const sourceWordRef = useRef<HTMLDivElement>(null)
  const shadowTextRef = useRef<HTMLDivElement>(null)
  const orbitParallaxRef = useRef<HTMLDivElement>(null)
  const orbitScrollRef = useRef<HTMLDivElement>(null)
  const orbitPrimaryRef = useRef<SVGSVGElement>(null)
  const orbitSecondaryRef = useRef<SVGSVGElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const hero = heroRef.current
    const wordSystem = wordSystemRef.current
    const sourceWord = sourceWordRef.current
    const shadowText = shadowTextRef.current
    const shadowGlyphs = shadowText?.querySelector<HTMLElement>('.hero-shadow-glyphs')
    const orbitParallax = orbitParallaxRef.current
    const orbitScroll = orbitScrollRef.current
    const orbitPrimary = orbitPrimaryRef.current
    const orbitSecondary = orbitSecondaryRef.current
    const copy = copyRef.current

    if (!hero || !wordSystem || !sourceWord || !shadowText || !shadowGlyphs || !orbitParallax || !orbitScroll || !orbitPrimary || !orbitSecondary || !copy) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouchLayout = window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth < 768
    // Embedded desktop browsers may incorrectly expose reduced motion. Keep the
    // requested interaction active when a real mouse is present, while still
    // using the calm static variant on touch/mobile layouts.
    const reducedMotion = isTouchLayout && prefersReducedMotion
    const canUsePointer = !isTouchLayout && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    let removePointerListeners: (() => void) | undefined
    let stopOrbitField: (() => void) | undefined

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      gsap.set(shadowText, {
        autoAlpha: reducedMotion ? 0.82 : 1,
      })

      if (!reducedMotion) {
        const header = document.querySelector<HTMLElement>('.site-header')
        const reveal = gsap.timeline({ defaults: { ease: 'power3.out' } })

        if (header) reveal.fromTo(header, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.42 })
        reveal
          .fromTo(wordSystem, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.64 }, header ? 0.12 : 0)
          .fromTo(shadowText, {
            autoAlpha: 0,
            y: -5,
          }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
          }, header ? 0.18 : 0.06)
          .fromTo('.hero-kicker', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.36 }, header ? 0.52 : 0.4)
          .fromTo('.hero-heading', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.48 }, header ? 0.59 : 0.47)
          .fromTo('.hero-description', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.38 }, header ? 0.71 : 0.59)

        // The following WHAT I DO scene owns the only pinned viewport on the
        // page. Keeping the hero in normal document flow prevents competing
        // pin spacers and the resulting scroll jump.
        gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
          .to(orbitScroll, { y: -8, scale: 1.004, opacity: 0.56, ease: 'none' }, 0)
      }

      const primaryPath = orbitPrimary.querySelector<SVGPathElement>('path')
      const secondaryPath = orbitSecondary.querySelector<SVGPathElement>('path')
      const primaryNodes = Array.from(orbitPrimary.querySelectorAll<SVGCircleElement>('circle'))
      const secondaryNodes = Array.from(orbitSecondary.querySelectorAll<SVGCircleElement>('circle'))

      if (reducedMotion) {
        orbitPrimary.pauseAnimations()
        orbitSecondary.pauseAnimations()
      }

      if (!reducedMotion && canUsePointer && primaryPath && secondaryPath) {
        const primaryBase = sampleOrbit({ x: 508, y: 84 }, primaryOrbitCurves)
        const secondaryBase = sampleOrbit({ x: 566, y: 145 }, secondaryOrbitCurves)
        let heroBounds = hero.getBoundingClientRect()
        let mouseX = heroBounds.width * 0.5
        let mouseY = heroBounds.height * 0.5
        let targetMouseX = mouseX
        let targetMouseY = mouseY
        let pointerInfluence = 0
        let targetPointerInfluence = 0
        let pointerVelocity = 0
        let lastPointerX = mouseX
        let lastPointerY = mouseY
        let lastPointerTime = performance.now()
        let animationFrame = 0
        let previousFrameTime = performance.now()
        let previousGeometryTime = 0
        let lastInteractionTime = 0
        let primaryProgress = 0.155
        let secondaryProgress = 0.805
        let isVisible = true

        const refreshOrbitBounds = () => {
          heroBounds = hero.getBoundingClientRect()
        }

        const deformOrbit = (base: OrbitPoint[], phase: number, strength: number) => {
          const screenScaleX = heroBounds.width / 1448
          const screenScaleY = heroBounds.height / 1086
          const radius = Math.min(360, Math.max(280, heroBounds.width * 0.2))
          const velocityBoost = Math.min(1, pointerVelocity / 1100)
          const maximumPull = (52 + velocityBoost * 16) * strength

          return base.map((point, index) => {
            const screenX = point.x * screenScaleX
            const screenY = point.y * screenScaleY
            const deltaX = mouseX - screenX
            const deltaY = mouseY - screenY
            const distance = Math.hypot(deltaX, deltaY)
            const falloff = distance < radius ? (1 - distance / radius) ** 2 : 0
            const safeDistance = Math.max(1, distance)
            const ambientDrift = Math.sin(phase + index * 0.115) * 2.1
            const pull = maximumPull * falloff * pointerInfluence

            return {
              x: point.x + (deltaX / safeDistance * pull + ambientDrift) / Math.max(0.001, screenScaleX),
              y: point.y + (deltaY / safeDistance * pull + ambientDrift * 0.42) / Math.max(0.001, screenScaleY),
            }
          })
        }

        const renderOrbitField = (now: number) => {
          if (!isVisible) {
            animationFrame = 0
            return
          }
          const deltaSeconds = Math.min(0.04, Math.max(0, (now - previousFrameTime) / 1000))
          previousFrameTime = now
          const pointerSmoothing = 1 - Math.exp(-deltaSeconds * 7.2)
          const influenceSmoothing = 1 - Math.exp(-deltaSeconds * 3.6)
          mouseX += (targetMouseX - mouseX) * pointerSmoothing
          mouseY += (targetMouseY - mouseY) * pointerSmoothing
          pointerInfluence += (targetPointerInfluence - pointerInfluence) * influenceSmoothing
          pointerVelocity *= Math.exp(-deltaSeconds * 4.8)

          // Rebuilding SVG path data is the expensive part. Updating it at a
          // stable 30fps still feels fluid because pointer inertia bridges the
          // frames, while substantially reducing main-thread work.
          if (now - previousGeometryTime >= 50) {
            const geometryDelta = Math.min(0.06, Math.max(0, (now - previousGeometryTime) / 1000))
            const time = now / 1000
            const primaryCurrent = deformOrbit(primaryBase, time * 0.34, 1)
            const secondaryCurrent = deformOrbit(secondaryBase, time * -0.29 + 2.1, 0.78)
            primaryPath.setAttribute('d', orbitPath(primaryCurrent))
            secondaryPath.setAttribute('d', orbitPath(secondaryCurrent))
            const proximityBoost = 1 + Math.min(1.3, pointerVelocity / 760) * pointerInfluence
            primaryProgress += geometryDelta * 0.012 * proximityBoost
            secondaryProgress -= geometryDelta * 0.009 * (1 + (proximityBoost - 1) * 0.7)
            primaryNodes.forEach((node, index) => {
              const point = orbitPointAt(primaryCurrent, primaryProgress + index * 0.285)
              node.setAttribute('cx', point.x.toFixed(1))
              node.setAttribute('cy', point.y.toFixed(1))
            })
            secondaryNodes.forEach((node, index) => {
              const point = orbitPointAt(secondaryCurrent, secondaryProgress - index * 0.31)
              node.setAttribute('cx', point.x.toFixed(1))
              node.setAttribute('cy', point.y.toFixed(1))
            })
            previousGeometryTime = now
          }

          const pointerIsMoving = now - lastInteractionTime < 180
          if (pointerIsMoving || (targetPointerInfluence === 0 && pointerInfluence > 0.004)) {
            animationFrame = window.requestAnimationFrame(renderOrbitField)
          } else {
            animationFrame = 0
          }
        }

        const scheduleOrbitRender = () => {
          if (!isVisible || animationFrame !== 0) return
          previousFrameTime = performance.now()
          previousGeometryTime = 0
          animationFrame = window.requestAnimationFrame(renderOrbitField)
        }

        const handleOrbitPointerMove = (event: PointerEvent) => {
          const now = performance.now()
          targetMouseX = event.clientX - heroBounds.left
          targetMouseY = event.clientY - heroBounds.top
          const elapsed = Math.max(16, now - lastPointerTime)
          pointerVelocity = Math.min(1800, Math.hypot(targetMouseX - lastPointerX, targetMouseY - lastPointerY) / elapsed * 1000)
          lastPointerX = targetMouseX
          lastPointerY = targetMouseY
          lastPointerTime = now
          lastInteractionTime = now
          targetPointerInfluence = 1
          scheduleOrbitRender()
        }

        const handleOrbitPointerLeave = () => {
          targetPointerInfluence = 0
          pointerVelocity = 0
          lastInteractionTime = performance.now()
          scheduleOrbitRender()
        }

        const observer = new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting
          if (!isVisible && animationFrame !== 0) {
            window.cancelAnimationFrame(animationFrame)
            animationFrame = 0
          } else if (isVisible && targetPointerInfluence > 0) {
            scheduleOrbitRender()
          }
        }, { threshold: 0.01 })

        observer.observe(hero)
        window.addEventListener('resize', refreshOrbitBounds, { passive: true })
        hero.addEventListener('pointermove', handleOrbitPointerMove, { passive: true })
        hero.addEventListener('pointerleave', handleOrbitPointerLeave)

        stopOrbitField = () => {
          observer.disconnect()
          window.cancelAnimationFrame(animationFrame)
          window.removeEventListener('resize', refreshOrbitBounds)
          hero.removeEventListener('pointermove', handleOrbitPointerMove)
          hero.removeEventListener('pointerleave', handleOrbitPointerLeave)
        }
      }

      if (!canUsePointer) return

      const shadowSkew = gsap.quickTo(shadowGlyphs, 'skewX', { duration: 0.95, ease: 'power3.out' })
      const shadowLength = gsap.quickTo(shadowGlyphs, 'scaleY', { duration: 1.05, ease: 'power3.out' })
      const shadowWidth = gsap.quickTo(shadowGlyphs, 'scaleX', { duration: 1.05, ease: 'power3.out' })
      const shadowOpacity = gsap.quickTo(shadowGlyphs, 'opacity', { duration: 0.75, ease: 'power2.out' })
      let heroBounds = hero.getBoundingClientRect()
      let wordBounds = sourceWord.getBoundingClientRect()
      let pointerFrame: number | null = null
      let pointerActive = false
      let pointerX = 0
      let pointerY = 0

      gsap.set(shadowGlyphs, {
        transformPerspective: 800,
        rotateX: 42,
        scaleX: 1.02,
        scaleY: 4.25,
        skewX: 0,
        transformOrigin: '50% 0%',
      })

      const refreshPointerBounds = () => {
        heroBounds = hero.getBoundingClientRect()
        wordBounds = sourceWord.getBoundingClientRect()
      }

      const renderPointer = () => {
        pointerFrame = null
        if (!pointerActive) return

        const wordCenterX = wordBounds.left + wordBounds.width / 2
        const horizontalLight = gsap.utils.clamp(
          -1,
          1,
          (pointerX - wordCenterX) / (heroBounds.width * 0.42),
        )
        const verticalDepth = gsap.utils.clamp(
          0,
          1,
          (pointerY - heroBounds.top) / Math.max(1, heroBounds.height),
        )

        // The top edge stays attached to DEGRA. Only the body of the projected
        // type bends away from the cursor, like a real shadow cast by a light.
        shadowSkew(horizontalLight * -8)
        shadowLength(gsap.utils.interpolate(4.8, 3.85, verticalDepth))
        shadowWidth(1.02 + Math.abs(horizontalLight) * 0.045)
        shadowOpacity(gsap.utils.interpolate(0.3, 1, verticalDepth))
      }

      const handlePointerMove = (event: PointerEvent) => {
        if (!pointerActive) {
          pointerActive = true
          refreshPointerBounds()
        }

        pointerX = event.clientX
        pointerY = event.clientY
        if (pointerFrame === null) pointerFrame = window.requestAnimationFrame(renderPointer)

      }

      const resetPointer = () => {
        pointerActive = false
        if (pointerFrame !== null) {
          window.cancelAnimationFrame(pointerFrame)
          pointerFrame = null
        }
        shadowSkew(0)
        shadowLength(4.25)
        shadowWidth(1.02)
        shadowOpacity(0.58)
      }

      hero.addEventListener('pointermove', handlePointerMove, { passive: true })
      hero.addEventListener('pointerleave', resetPointer)

      removePointerListeners = () => {
        hero.removeEventListener('pointermove', handlePointerMove)
        hero.removeEventListener('pointerleave', resetPointer)
      }
    }, hero)

    return () => {
      removePointerListeners?.()
      stopOrbitField?.()
      context.revert()
    }
  }, [])

  return (
    <section className="hero hero-living-shadow" data-header-theme="light" ref={heroRef}>
      <div className="hero-orbit-parallax" ref={orbitParallaxRef} aria-hidden="true">
        <div className="hero-orbit-scroll" ref={orbitScrollRef}>
          <div className="hero-orbit-ambient">
            <svg className="hero-orbits" viewBox="0 0 1448 1086" preserveAspectRatio="none" ref={orbitPrimaryRef}>
              <path id="hero-orbit-primary-path" d="M508 84C628 286 452 543 594 787C768 1019 1097 1048 1320 769C1450 606 1428 450 1264 389" />
              <use className="hero-orbit-echo hero-orbit-echo-primary" href="#hero-orbit-primary-path" />
              <circle cx="629" cy="582" r="5" />
              <circle cx="956" cy="874" r="3.6" />
              <circle cx="1322" cy="655" r="3.6" />
            </svg>
            <svg className="hero-orbits" viewBox="0 0 1448 1086" preserveAspectRatio="none" ref={orbitSecondaryRef}>
              <path id="hero-orbit-secondary-path" d="M566 145C648 297 518 540 674 717C835 898 1137 881 1300 677C1385 571 1394 471 1326 411" />
              <use className="hero-orbit-echo hero-orbit-echo-secondary" href="#hero-orbit-secondary-path" />
              <circle cx="1337" cy="500" r="5" />
              <circle cx="801" cy="786" r="3.4" />
              <circle cx="1198" cy="778" r="3.4" />
            </svg>
          </div>
        </div>
      </div>

      <div className="hero-word-system-anchor" aria-hidden="true">
        <div className="hero-word-system" ref={wordSystemRef}>
          <div className="hero-shadow-text" ref={shadowTextRef}>
            <div className="hero-shadow-glyphs">
              {wordmarkLetters.map((letter) => (
                <span className="hero-word-letter" key={`shadow-${letter}`}>{letter}</span>
              ))}
            </div>
          </div>
          <div className="hero-source-word" ref={sourceWordRef}>
            {wordmarkLetters.map((letter) => (
              <span className="hero-word-letter" key={`source-${letter}`}>{letter}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-copy" ref={copyRef}>
        <p className="hero-kicker"><span aria-hidden="true">•</span> {t.hero.kicker}</p>
        <h1 className="hero-heading">{t.hero.heading[0]}<br />{t.hero.heading[1]}</h1>
        <p className="hero-description">{t.hero.description[0]}<br />{t.hero.description[1]}</p>
      </div>
    </section>
  )
}
