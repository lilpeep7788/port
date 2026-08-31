import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n'

const letters = [
  {
    character: 'D',
    path: 'M-26 170H108C202 170 267 240 267 337V648C267 745 202 815 108 815H-26ZM81 256V731H108C149 731 171 703 171 661V327C171 284 149 256 108 256Z',
  },
  {
    character: 'E',
    path: 'M318 170H542V260H413V436H519V518H413V730H550V815H318Z',
  },
  {
    character: 'G',
    path: 'M742 161C647 161 584 235 584 338V640C584 744 648 816 742 816C804 816 850 790 889 759V529H797V650C797 706 779 731 742 731C701 731 680 701 680 649V328C680 276 702 248 742 248C779 248 797 272 797 321V376H889V326C889 223 833 161 742 161Z',
  },
  {
    character: 'R',
    path: 'M946 170H1086C1168 170 1216 220 1216 306V396C1216 452 1193 490 1148 511L1238 815H1140L1066 530H1041V815H946ZM1041 252V452H1085C1109 452 1122 435 1122 404V300C1122 268 1109 252 1085 252Z',
  },
  {
    character: 'A',
    path: 'M1362 170H1468L1538 815H1474L1459 702H1362L1348 815H1252ZM1415 327L1375 620H1454Z',
  },
]

const contactEmail = 'degrathink@gmail.com'

export function ContactFooter() {
  const { t } = useLanguage()
  const [emailCopied, setEmailCopied] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const wordScrollRef = useRef<HTMLDivElement>(null)
  const wordShiftRef = useRef<HTMLDivElement>(null)
  const cursorMaskRef = useRef<SVGCircleElement>(null)
  const endFillRef = useRef<SVGRectElement>(null)
  const letterRefs = useRef<Array<SVGGElement | null>>([])
  const emailRef = useRef<HTMLButtonElement>(null)
  const telegramRef = useRef<HTMLAnchorElement>(null)
  const instagramRef = useRef<HTMLAnchorElement>(null)
  const copyResetTimerRef = useRef<number | null>(null)

  const copyEmail = async () => {
    let copied = false

    try {
      await navigator.clipboard.writeText(contactEmail)
      copied = true
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = contactEmail
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      copied = document.execCommand('copy')
      textarea.remove()
    }

    if (!copied) return
    setEmailCopied(true)
    if (copyResetTimerRef.current) window.clearTimeout(copyResetTimerRef.current)
    copyResetTimerRef.current = window.setTimeout(() => setEmailCopied(false), 1800)
  }

  useEffect(() => {
    const section = sectionRef.current
    const scene = sceneRef.current
    const svg = svgRef.current
    const wordScroll = wordScrollRef.current
    const wordShift = wordShiftRef.current
    const cursorMask = cursorMaskRef.current
    const endFill = endFillRef.current
    const email = emailRef.current
    const telegram = telegramRef.current
    const instagram = instagramRef.current

    if (!section || !scene || !svg || !wordScroll || !wordShift || !cursorMask || !endFill || !email || !telegram || !instagram) return

    gsap.registerPlugin(ScrollTrigger)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointerEnabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const introDuration = reducedMotion ? 0.42 : 1
    const fillDuration = reducedMotion ? 0.24 : 0.62
    const shiftDistance = reducedMotion ? 5 : 12
    const outlines = gsap.utils.toArray<SVGPathElement>('.contact-letter-outline', svg)
    const primaryFills = gsap.utils.toArray<SVGPathElement>('.contact-letter-email-fill', svg)
    const endMark = svg.querySelector<SVGTextElement>('.contact-end-mark')
    const primaryUi = gsap.utils.toArray<HTMLElement>('.contact-primary-ui', section)
    const secondaryUi = gsap.utils.toArray<HTMLElement>('.contact-secondary-ui', section)
    const idleTweens: gsap.core.Tween[] = []

    const context = gsap.context(() => {
      outlines.forEach((outline) => {
        const length = outline.getTotalLength()
        gsap.set(outline, { strokeDasharray: length, strokeDashoffset: length, opacity: 0.18 })
      })
      gsap.set(primaryUi, { y: 12, opacity: 0 })
      gsap.set(secondaryUi, { y: 8, opacity: 0 })

      gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 72%', once: true } })
        .to(outlines, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: introDuration,
          stagger: 0.045,
          ease: 'power2.out',
        })
        .to(primaryUi, {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0.3 : 0.48,
          stagger: 0.04,
          ease: 'power2.out',
        }, reducedMotion ? 0.22 : 0.58)
        .to(secondaryUi, {
          y: 0,
          opacity: 1,
          duration: reducedMotion ? 0.3 : 0.5,
          stagger: 0.03,
          ease: 'power2.out',
        }, reducedMotion ? 0.28 : 0.7)

      if (!reducedMotion) {
        letterRefs.current.forEach((letter, index) => {
          if (!letter) return
          const scales = [1.018, 0.985, 1.014, 0.987, 1.016]
          idleTweens.push(gsap.to(letter, {
            scaleX: scales[index],
            scaleY: index % 2 === 0 ? 1.007 : 0.995,
            duration: 12 + index * 1.35,
            delay: 0.9 + index * 0.42,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            transformOrigin: 'center center',
            transformBox: 'fill-box',
          }))
        })
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: '62% center',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
        .to(primaryUi, { y: -18, opacity: 0, duration: 0.28, ease: 'none' }, 0)
        .to(secondaryUi, { opacity: 0, duration: 0.28, ease: 'none' }, 0.25)
        .to(endFill, { attr: { y: 0, height: 1024 }, duration: 1, ease: 'none' }, 0)
        .to(outlines, { opacity: 0.18, duration: 0.38, ease: 'none' }, 0.55)
        .to(endMark, { opacity: 1, duration: 0.2, ease: 'none' }, 0.76)
        .to(wordScroll, { scale: 1.012, duration: 1, ease: 'none' }, 0)
    }, section)

    const fillPrimary = () => gsap.to(primaryFills, { opacity: 0.96, duration: fillDuration, stagger: reducedMotion ? 0 : 0.025, ease: 'power2.inOut', overwrite: true })
    const clearPrimary = () => gsap.to(primaryFills, { opacity: 0, duration: reducedMotion ? 0.2 : 0.58, stagger: reducedMotion ? 0 : { each: 0.02, from: 'end' }, ease: 'power2.inOut', overwrite: true })
    const shiftLeft = () => gsap.to(wordShift, { x: -shiftDistance, duration: reducedMotion ? 0.25 : 0.72, ease: 'power3.out', overwrite: true })
    const shiftRight = () => gsap.to(wordShift, { x: shiftDistance, duration: reducedMotion ? 0.25 : 0.72, ease: 'power3.out', overwrite: true })
    const resetWord = () => gsap.to(wordShift, { x: 0, duration: reducedMotion ? 0.3 : 1.05, ease: 'power3.out', overwrite: true })

    telegram.addEventListener('pointerenter', fillPrimary)
    telegram.addEventListener('pointerleave', clearPrimary)
    email.addEventListener('pointerenter', shiftLeft)
    email.addEventListener('pointerleave', resetWord)
    instagram.addEventListener('pointerenter', shiftRight)
    instagram.addEventListener('pointerleave', resetWord)

    let frame = 0
    let lastPaint = 0
    const cursorRadius = 205
    const current = { x: 768, y: 512, r: 0 }
    const target = { x: 768, y: 512, r: 0 }

    const renderMask = (time: number) => {
      if (time - lastPaint < 42) {
        frame = requestAnimationFrame(renderMask)
        return
      }
      lastPaint = time

      current.x += (target.x - current.x) * 0.24
      current.y += (target.y - current.y) * 0.24
      current.r += (target.r - current.r) * 0.22
      cursorMask.setAttribute('cx', current.x.toFixed(1))
      cursorMask.setAttribute('cy', current.y.toFixed(1))
      cursorMask.setAttribute('r', current.r.toFixed(1))

      const moving = Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1 || Math.abs(target.r - current.r) > 0.1
      if (moving) frame = requestAnimationFrame(renderMask)
      else frame = 0
    }

    const startMaskFrame = () => {
      if (!frame) frame = requestAnimationFrame(renderMask)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect()
      target.x = ((event.clientX - rect.left) / rect.width) * 1536
      target.y = ((event.clientY - rect.top) / rect.height) * 1024
      target.r = reducedMotion ? 180 : cursorRadius
      startMaskFrame()
    }

    const handlePointerLeave = () => {
      target.r = 0
      startMaskFrame()
    }

    if (pointerEnabled) {
      scene.addEventListener('pointermove', handlePointerMove, { passive: true })
      scene.addEventListener('pointerleave', handlePointerLeave)
    }

    return () => {
      context.revert()
      idleTweens.forEach((tween) => tween.kill())
      telegram.removeEventListener('pointerenter', fillPrimary)
      telegram.removeEventListener('pointerleave', clearPrimary)
      email.removeEventListener('pointerenter', shiftLeft)
      email.removeEventListener('pointerleave', resetWord)
      instagram.removeEventListener('pointerenter', shiftRight)
      instagram.removeEventListener('pointerleave', resetWord)
      scene.removeEventListener('pointermove', handlePointerMove)
      scene.removeEventListener('pointerleave', handlePointerLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => () => {
    if (copyResetTimerRef.current) window.clearTimeout(copyResetTimerRef.current)
  }, [])

  return (
    <footer ref={sectionRef} className="contact-footer" id="contact" data-header-theme="dark">
      <div ref={sceneRef} className="contact-footer-scene">
        <div ref={wordScrollRef} className="contact-word-scroll" aria-hidden="true">
          <div ref={wordShiftRef} className="contact-word-shift">
            <svg ref={svgRef} className="contact-wordmark" viewBox="0 0 1536 1024" preserveAspectRatio="none">
              <defs>
                <radialGradient id="contact-cursor-gradient">
                  <stop offset="0" stopColor="white" />
                  <stop offset="0.9" stopColor="white" />
                  <stop offset="1" stopColor="black" />
                </radialGradient>
                <mask id="contact-cursor-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024">
                  <rect width="1536" height="1024" fill="black" />
                  <circle ref={cursorMaskRef} cx="768" cy="512" r="0" fill="url(#contact-cursor-gradient)" />
                </mask>
                <clipPath id="contact-end-clip" clipPathUnits="userSpaceOnUse">
                  <rect ref={endFillRef} x="0" y="1024" width="1536" height="0" />
                </clipPath>
              </defs>

              {letters.map((letter, index) => (
                <g key={letter.character} ref={(node) => { letterRefs.current[index] = node }} className="contact-letter-group" data-letter={letter.character}>
                  <path className="contact-letter contact-letter-outline" d={letter.path} fillRule="evenodd" />
                  <path className="contact-letter contact-letter-cursor-fill" d={letter.path} fillRule="evenodd" mask="url(#contact-cursor-mask)" />
                  <path className="contact-letter contact-letter-email-fill" d={letter.path} fillRule="evenodd" />
                  <path className="contact-letter contact-letter-end-fill" d={letter.path} fillRule="evenodd" clipPath="url(#contact-end-clip)" />
                </g>
              ))}
              <text className="contact-end-mark" x="1500" y="194">®</text>
            </svg>
          </div>
        </div>

        <div className="contact-center contact-primary-ui">
          <p>{t.footer.available}</p>
          <a ref={telegramRef} className="contact-email" href="https://t.me/degradation3" target="_blank" rel="noreferrer">
            <span>TELEGRAM</span><span aria-hidden="true">↗</span>
          </a>
          <div className="contact-social-row">
            <button ref={emailRef} className="contact-copy-email" type="button" onClick={copyEmail} aria-label={t.footer.copyEmail}>
              <span>E-MAIL</span>
              <span className="contact-copy-status" aria-live="polite">{emailCopied ? t.footer.copied : t.footer.copy}</span>
            </button>
            <a ref={instagramRef} href="https://www.instagram.com/degra.dation0/" target="_blank" rel="noreferrer">INSTAGRAM <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="contact-capabilities contact-secondary-ui" aria-label={t.whatIDo.services}>
          <span>{t.footer.capabilities[0]}</span><i aria-hidden="true">·</i><span>{t.footer.capabilities[1]}</span><i aria-hidden="true">·</i><span>{t.footer.capabilities[2]}</span><i aria-hidden="true">·</i><span>2026</span>
        </div>

        <div className="contact-footer-bottom contact-secondary-ui">
          <span>© 2026</span>
          <span>{t.footer.worldwide}</span>
        </div>
      </div>
    </footer>
  )
}
