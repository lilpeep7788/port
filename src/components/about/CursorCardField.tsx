import { useEffect, useRef } from 'react'
import type { Body, Engine } from 'matter-js'

type Language = 'ru' | 'en'
type MatterModule = typeof import('matter-js')
type MatterImport = MatterModule & { default?: MatterModule }

type AtlasSprite = {
  id: string
  sx: number
  sy: number
  sourceWidth: number
  sourceHeight: number
  width: number
  height: number
}

type CardParticle = {
  body: Body
  sprite: AtlasSprite
  bornAt: number
  fadeAt: number | null
  fadeDelay: number
  maxLife: number
}

type AtlasResult = {
  canvas: HTMLCanvasElement
  sprites: AtlasSprite[]
}

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

const ATLAS_SCALE = 2
const STEP = 1000 / 60
const RED = '#ff3228'
const BLACK = '#111111'
const WHITE = '#ffffff'
const BORDER = '#d8d8d4'
const PROJECT_IMAGES = [
  '/assets/project-slider/level-h2o/04-genesis-product.webp',
  '/assets/project-slider/carpaccio/05-photoshoot-faq.webp',
  '/assets/project-slider/vault77/06-porsche-carrera-hero.webp',
] as const

const atlasLayouts = [
  { id: 'photo', width: 76, height: 104, x: 0, y: 0 },
  { id: 'vertical-frame', width: 68, height: 108, x: 168, y: 0 },
  { id: 'timeline', width: 138, height: 42, x: 320, y: 0 },
  { id: 'contact-sheet', width: 92, height: 92, x: 612, y: 0 },
  { id: 'social', width: 118, height: 40, x: 0, y: 224 },
  { id: 'vertical', width: 136, height: 40, x: 252, y: 224 },
  { id: 'design', width: 114, height: 40, x: 540, y: 224 },
  { id: 'ai', width: 78, height: 40, x: 784, y: 224 },
  { id: 'rhythm', width: 116, height: 68, x: 0, y: 320 },
  { id: 'waveform', width: 132, height: 54, x: 248, y: 320 },
  { id: 'visual', width: 116, height: 68, x: 528, y: 320 },
] as const

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

function loadImage(source: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image()
    image.decoding = 'async'
    image.fetchPriority = 'low'
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = source
  })
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  x: number,
  y: number,
  width: number,
  height: number,
  fallback = BLACK,
) {
  if (!image || !image.naturalWidth || !image.naturalHeight) {
    context.fillStyle = fallback
    context.fillRect(x, y, width, height)
    return
  }

  const sourceRatio = image.naturalWidth / image.naturalHeight
  const targetRatio = width / height
  let sourceX = 0
  let sourceY = 0
  let sourceWidth = image.naturalWidth
  let sourceHeight = image.naturalHeight

  if (sourceRatio > targetRatio) {
    sourceWidth = sourceHeight * targetRatio
    sourceX = (image.naturalWidth - sourceWidth) / 2
  } else {
    sourceHeight = sourceWidth / targetRatio
    sourceY = (image.naturalHeight - sourceHeight) / 2
  }

  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height)
}

function drawCardBorder(context: CanvasRenderingContext2D, width: number, height: number, color = BORDER) {
  context.strokeStyle = color
  context.lineWidth = 1
  context.strokeRect(0.5, 0.5, width - 1, height - 1)
}

function drawTag(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  label: string,
  background: string,
  foreground: string,
  bordered = false,
) {
  context.fillStyle = background
  context.fillRect(0, 0, width, height)
  if (bordered) drawCardBorder(context, width, height, BLACK)
  context.fillStyle = foreground
  context.font = '600 17px "Inter Tight Variable", "Helvetica Neue", Arial, sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(label, width / 2, height / 2 + 0.5)
}

function buildAtlas(language: Language, images: Array<HTMLImageElement | null>): AtlasResult {
  const atlas = document.createElement('canvas')
  atlas.width = 1024
  atlas.height = 512
  const context = atlas.getContext('2d')
  if (!context) return { canvas: atlas, sprites: [] }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  const sprites: AtlasSprite[] = []

  for (const layout of atlasLayouts) {
    const sx = layout.x
    const sy = layout.y
    const sourceWidth = layout.width * ATLAS_SCALE
    const sourceHeight = layout.height * ATLAS_SCALE
    sprites.push({
      id: layout.id,
      sx,
      sy,
      sourceWidth,
      sourceHeight,
      width: layout.width,
      height: layout.height,
    })

    context.save()
    context.translate(sx, sy)
    context.scale(ATLAS_SCALE, ATLAS_SCALE)

    if (layout.id === 'photo') {
      context.fillStyle = WHITE
      context.fillRect(0, 0, layout.width, layout.height)
      drawImageCover(context, images[2], 4, 4, layout.width - 8, layout.height - 8)
      drawCardBorder(context, layout.width, layout.height)
    }

    if (layout.id === 'vertical-frame') {
      context.fillStyle = BLACK
      context.fillRect(0, 0, layout.width, layout.height)
      drawImageCover(context, images[0], 7, 7, layout.width - 14, layout.height - 21, '#272727')
      context.strokeStyle = WHITE
      context.lineWidth = 1
      context.strokeRect(6.5, 6.5, layout.width - 13, layout.height - 20)
      context.fillStyle = RED
      context.fillRect(7, layout.height - 9, layout.width - 14, 2)
    }

    if (layout.id === 'timeline') {
      context.fillStyle = WHITE
      context.fillRect(0, 0, layout.width, layout.height)
      const segmentWidth = 36
      drawImageCover(context, images[1], 7, 7, segmentWidth, layout.height - 14, '#ecece9')
      drawImageCover(context, images[2], 48, 7, segmentWidth, layout.height - 14, '#dcdcd8')
      drawImageCover(context, images[0], 89, 7, 42, layout.height - 14, '#c9c9c4')
      context.fillStyle = RED
      context.fillRect(85, 4, 2, layout.height - 8)
      drawCardBorder(context, layout.width, layout.height)
    }

    if (layout.id === 'contact-sheet') {
      context.fillStyle = WHITE
      context.fillRect(0, 0, layout.width, layout.height)
      drawImageCover(context, images[1], 5, 5, 39, 39, '#ededeb')
      drawImageCover(context, images[0], 48, 5, 39, 39, '#d4d4cf')
      context.fillStyle = RED
      context.fillRect(5, 48, 39, 39)
      drawImageCover(context, images[2], 48, 48, 39, 39, BLACK)
      drawCardBorder(context, layout.width, layout.height)
    }

    if (layout.id === 'social') drawTag(context, layout.width, layout.height, 'SOCIAL', BLACK, WHITE)
    if (layout.id === 'vertical') drawTag(context, layout.width, layout.height, 'VERTICAL', RED, WHITE)
    if (layout.id === 'design') drawTag(context, layout.width, layout.height, 'DESIGN', WHITE, BLACK, true)
    if (layout.id === 'ai') drawTag(context, layout.width, layout.height, 'AI', BLACK, WHITE)

    if (layout.id === 'rhythm' || layout.id === 'visual') {
      const isRhythm = layout.id === 'rhythm'
      const lines = language === 'ru'
        ? (isRhythm ? ['РИТМ', 'ПОДАЧА'] : ['ВИЗУАЛ', 'КОДЫ'])
        : (isRhythm ? ['RHYTHM', 'DELIVERY'] : ['VISUAL', 'CODES'])
      context.fillStyle = WHITE
      context.fillRect(0, 0, layout.width, layout.height)
      context.fillStyle = isRhythm ? BLACK : RED
      context.fillRect(8, 8, 7, 7)
      context.fillStyle = BLACK
      context.font = '600 16px "Inter Tight Variable", "Helvetica Neue", Arial, sans-serif'
      context.textAlign = 'left'
      context.textBaseline = 'alphabetic'
      context.fillText(lines[0], 23, 25)
      context.font = '500 13px "Inter Tight Variable", "Helvetica Neue", Arial, sans-serif'
      context.fillText(lines[1], 23, 47)
      context.strokeStyle = BORDER
      context.beginPath()
      context.moveTo(23, 32.5)
      context.lineTo(layout.width - 9, 32.5)
      context.stroke()
      drawCardBorder(context, layout.width, layout.height)
    }

    if (layout.id === 'waveform') {
      context.fillStyle = BLACK
      context.fillRect(0, 0, layout.width, layout.height)
      const bars = [8, 16, 25, 13, 31, 20, 10, 26, 18, 32, 15, 23, 9, 19]
      context.fillStyle = WHITE
      bars.forEach((barHeight, index) => {
        context.fillRect(9 + index * 8, (layout.height - barHeight) / 2, 2, barHeight)
      })
      context.fillStyle = RED
      context.beginPath()
      context.arc(layout.width - 10, layout.height / 2, 3.5, 0, Math.PI * 2)
      context.fill()
    }

    context.restore()
  }

  return { canvas: atlas, sprites }
}

export function CursorCardField({ language }: { language: Language }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const field = fieldRef.current
    const section = field?.closest<HTMLElement>('.about-intro')
    if (!canvas || !field || !section) return

    const interactionQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)')
    const idleWindow = window as IdleWindow
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    let cancelled = false
    let eligible = interactionQuery.matches
    let inViewport = true
    let matter: MatterModule | null = null
    let engine: Engine | null = null
    let atlas: AtlasResult | null = null
    let walls: Body[] = []
    let particles: CardParticle[] = []
    let rafId = 0
    let idleHandle = 0
    let timeoutHandle = 0
    let initialization: Promise<void> | null = null
    let width = 0
    let height = 0
    let dpr = 1
    let previousFrame = 0
    let accumulator = 0
    let pointerReady = false
    let lastPointerX = 0
    let lastPointerY = 0
    let lastPointerTime = 0
    let pointerVelocityX = 0
    let pointerVelocityY = 0
    let travelledDistance = 0
    let lastSpawnAt = 0
    let lastPointerActivity = performance.now()
    let lastSpriteIndex = -1
    let lowTier = false
    let frameCost = 0
    let measuredFrames = 0

    const getSoftCap = () => lowTier ? 16 : 28
    const getHardCap = () => lowTier ? 20 : 32
    const getSpawnInterval = () => lowTier ? 135 : 86

    const clearCanvas = () => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)
    }

    const stopFrame = () => {
      if (!rafId) return
      cancelAnimationFrame(rafId)
      rafId = 0
    }

    const removeParticle = (index: number) => {
      if (!engine || !matter) return
      const [particle] = particles.splice(index, 1)
      if (particle) matter.Composite.remove(engine.world, particle.body, true)
    }

    const clearParticles = () => {
      if (engine && matter) {
        for (const particle of particles) matter.Composite.remove(engine.world, particle.body, true)
      }
      particles = []
      stopFrame()
      clearCanvas()
    }

    const releaseCanvas = () => {
      canvas.width = 1
      canvas.height = 1
      canvas.style.removeProperty('width')
      canvas.style.removeProperty('height')
      width = 0
      height = 0
      dpr = 1
    }

    const rebuildBounds = () => {
      if (!engine || !matter) return
      for (const wall of walls) matter.Composite.remove(engine.world, wall, true)
      walls = [
        matter.Bodies.rectangle(width / 2, height + 39, width + 180, 80, { isStatic: true }),
        matter.Bodies.rectangle(-39, height / 2, 80, height + 220, { isStatic: true }),
        matter.Bodies.rectangle(width + 39, height / 2, 80, height + 220, { isStatic: true }),
      ]
      matter.Composite.add(engine.world, walls)
    }

    const resizeCanvas = () => {
      if (!eligible) return
      const bounds = section.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(bounds.width))
      const nextHeight = Math.max(1, Math.round(bounds.height))
      if (nextWidth === width && nextHeight === height) return

      width = nextWidth
      height = nextHeight
      dpr = Math.max(0.75, Math.min(
        window.devicePixelRatio || 1,
        1.5,
        Math.sqrt(4_000_000 / (width * height)),
      ))
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'high'
      if (particles.length) clearParticles()
      rebuildBounds()
    }

    const beginFade = (particle: CardParticle, now: number) => {
      if (particle.fadeAt === null) particle.fadeAt = now
    }

    const chooseSprite = () => {
      if (!atlas?.sprites.length) return null
      let nextIndex = Math.floor(Math.random() * atlas.sprites.length)
      if (nextIndex === lastSpriteIndex) nextIndex = (nextIndex + 1) % atlas.sprites.length
      lastSpriteIndex = nextIndex
      return atlas.sprites[nextIndex]
    }

    const ensureFrame = () => {
      if (rafId || !eligible || !inViewport || document.hidden || !particles.length) return
      previousFrame = performance.now()
      rafId = requestAnimationFrame(runFrame)
    }

    const spawnCard = (x: number, y: number, now: number) => {
      if (!engine || !matter || !atlas || particles.length >= getHardCap()) return
      const sprite = chooseSprite()
      if (!sprite) return

      if (particles.length >= getSoftCap()) {
        const oldest = particles.find((particle) => particle.fadeAt === null)
        if (oldest) beginFade(oldest, now)
      }

      const sizeScale = randomBetween(0.9, 1.08)
      const bodyWidth = sprite.width * sizeScale
      const bodyHeight = sprite.height * sizeScale
      const body = matter.Bodies.rectangle(
        clamp(x + randomBetween(-7, 7), bodyWidth / 2 + 2, width - bodyWidth / 2 - 2),
        clamp(y + randomBetween(-6, 6), 112, height - 42),
        bodyWidth,
        bodyHeight,
        {
          chamfer: { radius: 2 },
          restitution: randomBetween(0.12, 0.18),
          friction: randomBetween(0.42, 0.54),
          frictionAir: randomBetween(0.011, 0.017),
          density: 0.001,
          sleepThreshold: 48,
        },
      )

      matter.Body.setAngle(body, randomBetween(-0.11, 0.11))
      matter.Body.setVelocity(body, {
        x: clamp(pointerVelocityX * 0.28 + randomBetween(-1.4, 1.4), -8.5, 8.5),
        y: clamp(pointerVelocityY * 0.08 - randomBetween(2.2, 4.8), -7.5, 1.5),
      })
      matter.Body.setAngularVelocity(body, randomBetween(-0.018, 0.018))
      matter.Composite.add(engine.world, body)
      particles.push({
        body,
        sprite,
        bornAt: now,
        fadeAt: null,
        fadeDelay: randomBetween(2500, 4000),
        maxLife: randomBetween(7000, 9800),
      })
      field.classList.add('is-engaged')
      ensureFrame()
    }

    const drawParticles = (now: number) => {
      clearCanvas()
      if (!atlas) return

      for (const particle of particles) {
        const entranceProgress = clamp((now - particle.bornAt) / 120, 0, 1)
        const entranceScale = 0.82 + (1 - Math.pow(1 - entranceProgress, 3)) * 0.18
        const fadeProgress = particle.fadeAt === null ? 0 : clamp((now - particle.fadeAt) / 560, 0, 1)
        const opacity = 1 - fadeProgress
        const fadeScale = 1 - fadeProgress * 0.06
        const { body, sprite } = particle

        context.save()
        context.globalAlpha = opacity
        context.translate(body.position.x, body.position.y)
        context.rotate(body.angle)
        context.scale(entranceScale * fadeScale, entranceScale * fadeScale)
        context.drawImage(
          atlas.canvas,
          sprite.sx,
          sprite.sy,
          sprite.sourceWidth,
          sprite.sourceHeight,
          -sprite.width / 2,
          -sprite.height / 2,
          sprite.width,
          sprite.height,
        )
        context.restore()
      }
    }

    function runFrame(now: number) {
      rafId = 0
      if (!engine || !matter || !eligible || !inViewport || document.hidden || !particles.length) return
      const elapsed = Math.min(now - previousFrame, 50)
      previousFrame = now
      accumulator += elapsed
      if (accumulator < STEP - 0.75) {
        rafId = requestAnimationFrame(runFrame)
        return
      }
      const workStartedAt = performance.now()
      let substeps = 0

      while (accumulator >= STEP - 0.75 && substeps < 2) {
        matter.Engine.update(engine, STEP)
        accumulator = Math.max(0, accumulator - STEP)
        substeps += 1
      }
      if (substeps === 2) accumulator = 0

      const pointerIdleFor = now - lastPointerActivity
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index]
        const body = particle.body
        const age = now - particle.bornAt
        if (body.angle > 0.22) {
          matter.Body.setAngle(body, 0.22)
          matter.Body.setAngularVelocity(body, 0)
        } else if (body.angle < -0.22) {
          matter.Body.setAngle(body, -0.22)
          matter.Body.setAngularVelocity(body, 0)
        }

        if (particle.fadeAt === null) {
          if (age >= particle.maxLife) beginFade(particle, now)
          else if (body.isSleeping && age >= particle.fadeDelay) beginFade(particle, now)
          else if (pointerIdleFor > 1500 && body.isSleeping && age > 1200 + index * 80) beginFade(particle, now)
        }

        const outside = body.position.y > height + 300 || body.position.x < -300 || body.position.x > width + 300
        const fullyFaded = particle.fadeAt !== null && now - particle.fadeAt >= 560
        if (outside || fullyFaded) removeParticle(index)
      }

      drawParticles(now)
      frameCost += performance.now() - workStartedAt
      measuredFrames += 1
      if (!lowTier && measuredFrames >= 60) {
        if (frameCost / measuredFrames > 4.5) {
          lowTier = true
          for (let index = 0; index < Math.max(0, particles.length - getSoftCap()); index += 1) {
            beginFade(particles[index], now)
          }
        }
        frameCost = 0
        measuredFrames = 0
      }

      if (particles.length) rafId = requestAnimationFrame(runFrame)
    }

    const initialize = () => {
      if (initialization) return initialization
      initialization = (async () => {
        const [matterImport, loadedImages] = await Promise.all([
          import('matter-js'),
          Promise.all(PROJECT_IMAGES.map(loadImage)),
          document.fonts.ready,
        ]).then(([matterModule, images]) => [matterModule, images] as const)
        if (cancelled) return
        if (!eligible) {
          initialization = null
          return
        }

        const loadedMatter = ((matterImport as MatterImport).default ?? matterImport) as MatterModule
        matter = loadedMatter
        atlas = buildAtlas(language, loadedImages)
        engine = matter.Engine.create({
          enableSleeping: true,
          gravity: { x: 0, y: 1.18, scale: 0.00145 },
        })
        engine.positionIterations = 4
        engine.velocityIterations = 3
        engine.constraintIterations = 1

        const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number }
        lowTier = (navigator.hardwareConcurrency || 8) <= 4 || (navigatorWithMemory.deviceMemory || 8) <= 4
        resizeCanvas()
        if (!walls.length) rebuildBounds()
      })()
      return initialization
    }

    const scheduleInitialization = () => {
      if (!eligible || initialization || idleHandle || timeoutHandle) return
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(() => {
          idleHandle = 0
          void initialize()
        }, { timeout: 900 })
      } else {
        timeoutHandle = window.setTimeout(() => {
          timeoutHandle = 0
          void initialize()
        }, 180)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!eligible || !inViewport || (event.pointerType !== 'mouse' && event.pointerType !== 'pen')) return
      if (!engine) {
        scheduleInitialization()
        void initialize()
      }

      const bounds = section.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      const now = performance.now()
      lastPointerActivity = now

      if (!pointerReady) {
        pointerReady = true
        lastPointerX = x
        lastPointerY = y
        lastPointerTime = now
        return
      }

      const deltaX = x - lastPointerX
      const deltaY = y - lastPointerY
      const deltaTime = Math.max(8, now - lastPointerTime)
      const distance = Math.hypot(deltaX, deltaY)
      pointerVelocityX = (deltaX / deltaTime) * STEP
      pointerVelocityY = (deltaY / deltaTime) * STEP
      travelledDistance += distance

      if (engine && atlas && y > 108 && travelledDistance >= 48 && now - lastSpawnAt >= getSpawnInterval()) {
        const spawnCount = Math.min(2, Math.floor(travelledDistance / 48))
        for (let index = 0; index < spawnCount; index += 1) {
          const progress = spawnCount === 1 ? 1 : (index + 1) / spawnCount
          spawnCard(lastPointerX + deltaX * progress, lastPointerY + deltaY * progress, now + index)
        }
        travelledDistance %= 48
        lastSpawnAt = now
      }

      lastPointerX = x
      lastPointerY = y
      lastPointerTime = now
    }

    const handlePointerEnter = () => {
      pointerReady = false
      scheduleInitialization()
    }

    const handlePointerLeave = () => {
      pointerReady = false
      travelledDistance = 0
    }

    const handleEligibilityChange = () => {
      eligible = interactionQuery.matches
      if (!eligible) {
        clearParticles()
        releaseCanvas()
        return
      }
      resizeCanvas()
      scheduleInitialization()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) clearParticles()
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting && entry.intersectionRatio > 0.1
      if (!inViewport) clearParticles()
      else scheduleInitialization()
    }, { threshold: [0, 0.1, 0.35] })

    const resizeObserver = new ResizeObserver(() => {
      if (eligible) resizeCanvas()
    })
    intersectionObserver.observe(section)
    resizeObserver.observe(section)
    section.addEventListener('pointerenter', handlePointerEnter, { passive: true })
    section.addEventListener('pointermove', handlePointerMove, { passive: true })
    section.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    interactionQuery.addEventListener('change', handleEligibilityChange)
    if (eligible) scheduleInitialization()
    else releaseCanvas()

    return () => {
      cancelled = true
      stopFrame()
      if (idleHandle && idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idleHandle)
      if (timeoutHandle) window.clearTimeout(timeoutHandle)
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
      section.removeEventListener('pointerenter', handlePointerEnter)
      section.removeEventListener('pointermove', handlePointerMove)
      section.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      interactionQuery.removeEventListener('change', handleEligibilityChange)
      clearParticles()
      if (engine && matter) {
        matter.Composite.clear(engine.world, false, true)
        matter.Engine.clear(engine)
      }
      engine = null
      matter = null
      atlas = null
    }
  }, [language])

  return (
    <div ref={fieldRef} className="about-card-field" aria-hidden="true">
      <canvas ref={canvasRef} className="about-card-canvas" width={1} height={1} />
      <span className="about-cursor-hint">
        <span aria-hidden="true" />
        {language === 'ru' ? 'Проведи мышью' : 'Move your cursor'}
      </span>
    </div>
  )
}
