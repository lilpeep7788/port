import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'

type ServiceVisual = {
  src: string
  alt: string
  role: 'primary' | 'secondary' | 'detail'
  strength: number
}

type ServiceScene = {
  id: 'web' | 'ai' | 'app'
  title: string[]
  directions: string
  visuals: ServiceVisual[]
}

const wordmarkMedia = [
  '/assets/projects/carpaccio/01-laptop-hero-mono.jpg',
  '/assets/projects/vault77/01-laptop-hero-mono.jpg',
  '/assets/projects/level-h2o/01-laptop-hero-mono.jpg',
]

const serviceScenes: Record<'ru' | 'en', ServiceScene[]> = {
  ru: [
  {
    id: 'web',
    title: ['ВЕБ-ДИЗАЙН', 'И РАЗРАБОТКА'],
    directions: 'Сайты / Лендинги / Фронтенд / Интернет-магазины',
    visuals: [
      { src: '/assets/services-scene/web/web-laptop-v3.png', alt: 'Сайт архитектурной студии на ноутбуке', role: 'primary', strength: 0.52 },
      { src: '/assets/services-scene/web/web-phone-v3.png', alt: 'Мобильная версия сайта архитектурной студии', role: 'secondary', strength: 0.85 },
      { src: '/assets/services-scene/web/web-board-v3.png', alt: 'Презентация подхода к веб-дизайну', role: 'detail', strength: 0.38 },
    ],
  },
  {
    id: 'ai',
    title: ['TELEGRAM-БОТЫ', 'И AI-АГЕНТЫ'],
    directions: 'Telegram-боты / AI-агенты / Автоматизация / Интеграции',
    visuals: [
      { src: '/assets/services-scene/ai/ai-laptop-v3.png', alt: 'Рабочая панель AI-агента на ноутбуке', role: 'primary', strength: 0.52 },
      { src: '/assets/services-scene/ai/ai-phone-v3.png', alt: 'Интерфейс Telegram-бота с автоматизацией', role: 'secondary', strength: 0.85 },
      { src: '/assets/services-scene/ai/ai-integrations-v3.png', alt: 'Схема интеграций AI-агента', role: 'detail', strength: 0.38 },
    ],
  },
  {
    id: 'app',
    title: ['ДИЗАЙН И', 'РАЗРАБОТКА', 'ПРИЛОЖЕНИЙ'],
    directions: 'UI/UX / Мобильные приложения / Продуктовый дизайн / Разработка',
    visuals: [
      { src: '/assets/services-scene/app/app-home-v3.png', alt: 'Главный экран финансового приложения', role: 'primary', strength: 0.82 },
      { src: '/assets/services-scene/app/app-analytics-v3.png', alt: 'Экран аналитики мобильного приложения', role: 'secondary', strength: 0.58 },
      { src: '/assets/services-scene/app/app-transfer-v3.png', alt: 'Экран перевода мобильного приложения', role: 'detail', strength: 0.66 },
    ],
  },
  ],
  en: [
    {
      id: 'web',
      title: ['WEB DESIGN', '& DEVELOPMENT'],
      directions: 'Websites / Landing pages / Frontend / E-commerce',
      visuals: [
        { src: '/assets/services-scene/web/web-laptop-v3.png', alt: 'Architecture studio website on a laptop', role: 'primary', strength: 0.52 },
        { src: '/assets/services-scene/web/web-phone-v3.png', alt: 'Mobile version of an architecture studio website', role: 'secondary', strength: 0.85 },
        { src: '/assets/services-scene/web/web-board-v3.png', alt: 'Web design approach presentation', role: 'detail', strength: 0.38 },
      ],
    },
    {
      id: 'ai',
      title: ['TELEGRAM BOTS', '& AI AGENTS'],
      directions: 'Telegram bots / AI agents / Automation / Integrations',
      visuals: [
        { src: '/assets/services-scene/ai/ai-laptop-v3.png', alt: 'AI agent dashboard on a laptop', role: 'primary', strength: 0.52 },
        { src: '/assets/services-scene/ai/ai-phone-v3.png', alt: 'Telegram bot interface with automation', role: 'secondary', strength: 0.85 },
        { src: '/assets/services-scene/ai/ai-integrations-v3.png', alt: 'AI agent integrations diagram', role: 'detail', strength: 0.38 },
      ],
    },
    {
      id: 'app',
      title: ['APP DESIGN', 'AND', 'DEVELOPMENT'],
      directions: 'UI/UX / Mobile apps / Product design / Development',
      visuals: [
        { src: '/assets/services-scene/app/app-home-v3.png', alt: 'Financial app home screen', role: 'primary', strength: 0.82 },
        { src: '/assets/services-scene/app/app-analytics-v3.png', alt: 'Mobile app analytics screen', role: 'secondary', strength: 0.58 },
        { src: '/assets/services-scene/app/app-transfer-v3.png', alt: 'Mobile app money transfer screen', role: 'detail', strength: 0.66 },
      ],
    },
  ],
}

export function CloudWordmarkSection() {
  const { language, t } = useLanguage()
  const scenes = serviceScenes[language]
  const [mediaReady, setMediaReady] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<SVGSVGElement>(null)
  const trajectoriesRef = useRef<SVGSVGElement>(null)
  const introMetaRef = useRef<HTMLDivElement>(null)
  const projectMediaRefs = useRef<SVGGElement[]>([])
  const serviceRefs = useRef<Array<HTMLElement | null>>([])
  const visualRefs = useRef<Array<Array<HTMLDivElement | null>>>([[], [], []])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (!('IntersectionObserver' in window)) {
      setMediaReady(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setMediaReady(true)
      observer.disconnect()
    }, { rootMargin: '240px 0px' })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const section = sectionRef.current
    const scene = sceneRef.current
    const intro = introRef.current
    const wordmark = wordmarkRef.current
    const trajectories = trajectoriesRef.current
    const introMeta = introMetaRef.current
    if (!section || !scene || !intro || !wordmark || !trajectories || !introMeta) return

    gsap.registerPlugin(ScrollTrigger)
    const mediaContext = gsap.matchMedia()

    mediaContext.add('(min-width: 0px)', () => {

      let activeScene = 0
      let pointerFrame = 0
      let pointerX = 0
      let pointerY = 0
      let sceneProgress = 0
      let rectsDirty = true
      let cleanupInteractions = () => undefined

      const context = gsap.context(() => {
      const services = serviceRefs.current.filter((item): item is HTMLElement => Boolean(item))
      const mediaItems = projectMediaRefs.current
      const canUseMagnetism = window.innerWidth >= 768

      const resetIntroState = () => {
        gsap.set(intro, { autoAlpha: 1 })
        gsap.set(services, { autoAlpha: 0, visibility: 'hidden' })
      }

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${section.offsetHeight - window.innerHeight}`,
          scrub: 0.9,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            sceneProgress = self.progress
            activeScene = self.progress < 0.43 ? 0 : self.progress < 0.7 ? 1 : 2
            rectsDirty = true
            if (self.progress <= 0.001) resetIntroState()
          },
          onLeaveBack: resetIntroState,
        },
      })

      resetIntroState()

      services.forEach((service, sceneIndex) => {
        const lines = gsap.utils.toArray<HTMLElement>('.service-scene-title span', service)
        const directions = service.querySelector<HTMLElement>('.service-scene-directions')
        const visuals = visualRefs.current[sceneIndex].filter((item): item is HTMLDivElement => Boolean(item))
        gsap.set(lines, { yPercent: 112, opacity: 0 })
        gsap.set(directions, { y: 22, opacity: 0 })
        gsap.set(visuals, { opacity: 0 })
      })

      timeline
        .to(introMeta, { y: -18, opacity: 0, duration: 0.65 }, 1.05)
        .to(trajectories, { opacity: 0.22, scale: 1.025, transformOrigin: '50% 50%', duration: 1.35 }, 1.05)
        .to(mediaItems[0], { x: -76, y: 34, duration: 1.55 }, 1.08)
        .to(mediaItems[1], { x: 62, y: -42, duration: 1.55 }, 1.08)
        .to(mediaItems[2], { x: 34, y: 58, scale: 1.05, transformOrigin: '50% 50%', duration: 1.55 }, 1.08)
        .to(wordmark, { yPercent: -2.5, scale: 1.075, opacity: 0.055, transformOrigin: '50% 48%', duration: 1.65 }, 1.08)
        .fromTo(
          intro,
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.28, immediateRender: false },
          2.48,
        )

      const addScene = (sceneIndex: number, start: number, exit: number) => {
        const service = services[sceneIndex]
        const lines = gsap.utils.toArray<HTMLElement>('.service-scene-title span', service)
        const directions = service.querySelector<HTMLElement>('.service-scene-directions')
        const visuals = visualRefs.current[sceneIndex].filter((item): item is HTMLDivElement => Boolean(item))
        const entrance = sceneIndex === 0
          ? [{ x: 82, y: 76, scale: 0.955 }, { x: 96, y: 16, scale: 0.97 }, { x: -42, y: 68, scale: 0.93 }]
          : sceneIndex === 1
            ? [{ x: -92, y: 42, scale: 0.95 }, { x: 76, y: 72, scale: 0.965 }, { x: 34, y: -42, scale: 0.94 }]
            : [{ x: 0, y: 118, scale: 0.955 }, { x: 38, y: 142, scale: 0.94 }, { x: -32, y: 126, scale: 0.965 }]
        const copyDelay = sceneIndex === 0 ? 0.08 : 0.62
        const directionsDelay = sceneIndex === 0 ? 0.56 : 0.98
        const visualDelay = sceneIndex === 0 ? 0.36 : -0.08

        timeline
          .to(service, { autoAlpha: 1, duration: 0.24 }, start)
          .to(lines, { yPercent: 0, opacity: 1, duration: 0.78, stagger: 0.075 }, start + copyDelay)
          .to(directions, { y: 0, opacity: 1, duration: 0.58 }, start + directionsDelay)

        visuals.forEach((visual, visualIndex) => {
          timeline.fromTo(
            visual,
            { ...entrance[visualIndex], opacity: 0 },
            { x: 0, y: 0, scale: 1, opacity: 1, duration: visualIndex === 0 ? 1.02 : 0.86 },
            start + visualDelay + visualIndex * 0.16,
          )
        })

        if (sceneIndex === 0) {
          timeline
            .to(lines, { x: -74, opacity: 0, duration: 0.7, stagger: 0.035 }, exit)
            .to(directions, { x: -34, opacity: 0, duration: 0.52 }, exit + 0.08)
            .to(visuals[0], { x: 118, y: -24, scale: 1.014, opacity: 0, duration: 0.82 }, exit)
            .to(visuals[1], { x: 92, y: 24, opacity: 0, duration: 0.74 }, exit + 0.02)
            .to(visuals[2], { x: -56, y: 82, scale: 0.97, opacity: 0, duration: 0.72 }, exit + 0.04)
        } else if (sceneIndex === 1) {
          timeline
            .to(lines, { x: -82, opacity: 0, duration: 0.68, stagger: 0.035 }, exit)
            .to(directions, { y: -18, opacity: 0, duration: 0.5 }, exit + 0.08)
            .to(visuals[0], { x: -132, y: -18, opacity: 0, duration: 0.8 }, exit)
            .to(visuals[1], { x: 112, y: -8, opacity: 0, duration: 0.75 }, exit + 0.02)
            .to(visuals[2], { y: 122, scale: 0.96, opacity: 0, duration: 0.68 }, exit + 0.06)
        } else {
          timeline
            .to(service, { y: -28, opacity: 0.42, duration: 0.85 }, exit)
            .to(visuals, { y: -22, duration: 0.85, stagger: 0.035 }, exit)
        }

        if (sceneIndex < 2) timeline.to(service, { visibility: 'hidden', duration: 0.01 }, exit + 0.84)
      }

      addScene(0, 2.05, 5.18)
      addScene(1, 5.42, 8.66)
      addScene(2, 8.92, 12.18)

      gsap.delayedCall(0.85, () => ScrollTrigger.refresh())

      type MagneticState = {
        currentX: number
        currentY: number
        targetX: number
        targetY: number
        renderedX: number
        renderedY: number
        element: HTMLElement
      }

      const magneticNodes = visualRefs.current.flat().filter((item): item is HTMLDivElement => Boolean(item))
      const visualStates = new Map<HTMLDivElement, MagneticState>()
      magneticNodes.forEach((node) => {
        const element = node.querySelector<HTMLElement>('.service-visual-magnetic')
        if (element) visualStates.set(node, {
          currentX: 0,
          currentY: 0,
          targetX: 0,
          targetY: 0,
          renderedX: Number.NaN,
          renderedY: Number.NaN,
          element,
        })
      })
      const allStates = [...visualStates.values()]
      const rectCache = new Map<Element, DOMRect>()
      let pointerInside = false
      let previousFrameTime = 0
      let targetsDirty = false

      const writeTransform = (state: MagneticState) => {
        const nextX = Math.round(state.currentX * 100) / 100
        const nextY = Math.round(state.currentY * 100) / 100
        if (nextX === state.renderedX && nextY === state.renderedY) return
        state.renderedX = nextX
        state.renderedY = nextY
        state.element.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`
      }

      const resetTargets = () => {
        allStates.forEach((state) => {
          state.targetX = 0
          state.targetY = 0
        })
      }

      const updateTargets = () => {
        resetTargets()

        if (sceneProgress < 0.13) return
        const activeVisuals = visualRefs.current[activeScene].filter((item): item is HTMLDivElement => Boolean(item))
        activeVisuals.forEach((visual) => {
          const rect = rectCache.get(visual) ?? visual.getBoundingClientRect()
          rectCache.set(visual, rect)
          const deltaX = pointerX - (rect.left + rect.width / 2)
          const deltaY = pointerY - (rect.top + rect.height / 2)
          const distance = Math.hypot(deltaX, deltaY)
          const radius = Math.max(rect.width, rect.height) * 1.3
          const proximity = Math.max(0, 1 - distance / radius)
          const strength = Number(visual.dataset.strength ?? 0.7)
          const centerFalloff = Math.min(1, distance / Math.max(1, radius * 0.3))
          const amount = 48 * strength * proximity ** 1.45 * centerFalloff
          const state = visualStates.get(visual)
          if (!state) return
          state.targetX = distance ? (deltaX / distance) * amount : 0
          state.targetY = distance ? (deltaY / distance) * amount : 0
        })
      }

      const renderMagnetism = (time: number) => {
        pointerFrame = 0
        if (targetsDirty) {
          updateTargets()
          targetsDirty = false
        }
        const delta = previousFrameTime ? Math.min(34, time - previousFrameTime) : 16.7
        previousFrameTime = time
        const smoothing = 1 - Math.exp(-delta * (pointerInside ? 0.021 : 0.014))
        let moving = false

        allStates.forEach((state) => {
          state.currentX += (state.targetX - state.currentX) * smoothing
          state.currentY += (state.targetY - state.currentY) * smoothing
          if (Math.abs(state.targetX - state.currentX) < 0.03) state.currentX = state.targetX
          if (Math.abs(state.targetY - state.currentY) < 0.03) state.currentY = state.targetY
          writeTransform(state)
          if (state.currentX !== state.targetX || state.currentY !== state.targetY) moving = true
        })

        if (moving || targetsDirty) pointerFrame = requestAnimationFrame(renderMagnetism)
        else previousFrameTime = 0
      }

      const requestMagneticFrame = () => {
        if (!pointerFrame) pointerFrame = requestAnimationFrame(renderMagnetism)
      }

      const handlePointerMove = (event: PointerEvent) => {
        if (!canUseMagnetism || event.pointerType === 'touch') return
        // The pinned scene already sits under the browser's initial cursor, so
        // pointerenter is not guaranteed to fire before the first move.
        if (!pointerInside) {
          pointerInside = true
          rectsDirty = true
        }
        pointerX = event.clientX
        pointerY = event.clientY
        if (rectsDirty) {
          rectCache.clear()
          rectsDirty = false
        }
        targetsDirty = true
        requestMagneticFrame()
      }

      const handlePointerEnter = (event: PointerEvent) => {
        if (!canUseMagnetism || event.pointerType === 'touch') return
        pointerInside = true
        rectsDirty = true
      }

      const resetMagnetism = () => {
        pointerInside = false
        targetsDirty = false
        resetTargets()
        requestMagneticFrame()
      }

      const handleResize = () => { rectsDirty = true }

      if (canUseMagnetism) {
        scene.addEventListener('pointerenter', handlePointerEnter, { passive: true })
        scene.addEventListener('pointermove', handlePointerMove, { passive: true })
        scene.addEventListener('pointerleave', resetMagnetism, { passive: true })
        window.addEventListener('resize', handleResize, { passive: true })
        window.addEventListener('blur', resetMagnetism)
      }

      cleanupInteractions = () => {
        if (canUseMagnetism) {
          scene.removeEventListener('pointerenter', handlePointerEnter)
          scene.removeEventListener('pointermove', handlePointerMove)
          scene.removeEventListener('pointerleave', resetMagnetism)
          window.removeEventListener('resize', handleResize)
          window.removeEventListener('blur', resetMagnetism)
        }
        if (pointerFrame) cancelAnimationFrame(pointerFrame)
        allStates.forEach((state) => {
          state.element.style.transform = ''
          state.renderedX = Number.NaN
          state.renderedY = Number.NaN
        })
      }
      }, section)

      return () => {
        cleanupInteractions()
        context.revert()
      }
    })

    return () => {
      mediaContext.revert()
    }
  }, [])

  const setProjectMediaRef = (element: SVGGElement | null, index: number) => {
    if (element) projectMediaRefs.current[index] = element
  }

  return (
    <section className="cloud-section" id="about" aria-labelledby="what-i-do-title" data-header-theme="light" ref={sectionRef}>
      <div className="whatido-scene" ref={sceneRef}>
        <div className="whatido-intro" ref={introRef}>
          <svg className="whatido-trajectories" viewBox="0 0 1600 900" aria-hidden="true" ref={trajectoriesRef}>
            <path d="M-92 830C90 408 498 910 986 756C1382 632 1520 328 1400 276C1294 228 1180 272 1084 336" />
            <path d="M-62 902C66 684 194 568 410 518" />
            <circle cx="212" cy="588" r="7" />
            <circle cx="1388" cy="286" r="7" />
          </svg>

          <svg className="whatido-wordmark" viewBox="0 0 1600 900" role="img" aria-labelledby="what-i-do-title what-i-do-description" ref={wordmarkRef}>
            <title id="what-i-do-title">What I do</title>
            <desc id="what-i-do-description">Selected DEGRA project imagery revealed inside the words What I Do.</desc>
            <defs>
              <mask id="what-i-do-mask">
                <rect width="1600" height="900" fill="#000" />
                <text className="whatido-mask-type" x="28" y="412" textLength="1536" lengthAdjust="spacingAndGlyphs">WHAT</text>
                <text className="whatido-mask-type whatido-mask-type--lower" x="258" y="862" textLength="1080" lengthAdjust="spacingAndGlyphs">I DO</text>
              </mask>
            </defs>

            <g className="whatido-media-layer" mask="url(#what-i-do-mask)">
              <g className="whatido-project-media" ref={(element) => setProjectMediaRef(element, 0)}>
                <image href={wordmarkMedia[0]} x="-42" y="-12" width="720" height="456" preserveAspectRatio="xMidYMid slice" />
                <image href={wordmarkMedia[0]} x="136" y="412" width="410" height="395" preserveAspectRatio="xMidYMid slice" />
              </g>
              <g className="whatido-project-media" ref={(element) => setProjectMediaRef(element, 1)}>
                <image href={wordmarkMedia[1]} x="510" y="-22" width="658" height="480" preserveAspectRatio="xMidYMid slice" />
                <image href={wordmarkMedia[1]} x="452" y="398" width="544" height="420" preserveAspectRatio="xMidYMid slice" />
              </g>
              <g className="whatido-project-media" ref={(element) => setProjectMediaRef(element, 2)}>
                <image href={wordmarkMedia[2]} x="1088" y="-8" width="562" height="460" preserveAspectRatio="xMidYMid slice" />
                <image href={wordmarkMedia[2]} x="928" y="406" width="580" height="402" preserveAspectRatio="xMidYMid slice" />
              </g>
            </g>
          </svg>

          <div className="whatido-intro-meta" ref={introMetaRef}>
            <div className="whatido-capabilities">
              <p className="whatido-eyebrow"><span aria-hidden="true" />{t.whatIDo.eyebrow}</p>
              <p>{t.whatIDo.capabilities[0]}<br />{t.whatIDo.capabilities[1]}<br />{t.whatIDo.capabilities[2]}<br />{t.whatIDo.capabilities[3]}</p>
            </div>

            <button className="whatido-scroll-hint" type="button" onClick={() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              <span>{t.whatIDo.hint[0]}<br />{t.whatIDo.hint[1]}</span>
              <svg viewBox="0 0 12 62" aria-hidden="true"><path d="M6 0V51M1 47L6 52L11 47" /></svg>
            </button>
          </div>
        </div>

        <div className="service-scenes" role="group" aria-label={t.whatIDo.services}>
          {scenes.map((service, sceneIndex) => (
            <div
              className={`service-state service-scene--${service.id}`}
              key={service.id}
              ref={(node) => { serviceRefs.current[sceneIndex] = node }}
              role="group"
              aria-labelledby={`service-${service.id}-title`}
            >
              <div className="service-scene-copy">
                <h2 className="service-scene-title" id={`service-${service.id}-title`}>
                  {service.title.map((line, lineIndex) => (
                    <span key={`${service.id}-line-${lineIndex}`}>{line}</span>
                  ))}
                </h2>
                <p className="service-scene-directions">{service.directions}</p>
              </div>

              <div className="service-visual-stage">
                {service.visuals.map((visual, visualIndex) => (
                  <div
                    className={`service-visual service-visual--${visual.role}`}
                    data-strength={visual.strength}
                    key={visual.src}
                    ref={(node) => { visualRefs.current[sceneIndex][visualIndex] = node }}
                  >
                    <div className="service-visual-magnetic">
                      {mediaReady && (
                        <img
                          src={visual.src}
                          alt={visual.alt}
                          loading="lazy"
                          fetchPriority="low"
                          decoding="async"
                          draggable="false"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
