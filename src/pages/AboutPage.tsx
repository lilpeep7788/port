import { lazy, Suspense, useEffect, useRef, useState, type PointerEvent } from 'react'
import { useLanguage } from '../i18n'

type DisciplineKey = 'copywriting' | 'editing' | 'carousels'

const aboutCopy = {
  ru: {
    intro: {
      label: 'Обо мне',
      title: ['Я понимаю интернет', 'изнутри.'],
      body: [
        'Цифровой дизайнер и креатор из Москвы.',
        'Работаю с соцсетями, vertical-контентом,',
        'визуальными системами и AI.',
      ],
      university: 'Финансовый университет / Москва',
      focus: 'Design · Social · Vertical · AI',
      photoCaption: 'Москва',
      photoAlt: 'DEGRA под аркой из еловых ветвей и огней',
    },
    method: {
      title: ['Всё вокруг', 'вертикального', 'контента'],
      body: 'Помогаю брендам и экспертам говорить с аудиторией на её языке — в вертикальном формате.',
      contact: 'Обсудить проект',
      navigation: 'Направления вертикального контента',
      phoneLabel: 'Интерактивный экран вертикального контента',
      disciplines: {
        copywriting: {
          title: 'Копирайтинг',
          tags: ['Тексты', 'Сценарии', 'Структура'],
          description: 'Нахожу первую фразу, после которой не хочется листать дальше.',
          phoneTitle: 'Текст, который цепляет',
          phoneBody: 'Смысл, структура и подача — с первой секунды.',
        },
        editing: {
          title: 'Монтаж',
          tags: ['Reels', 'Shorts', 'TikTok'],
          description: 'Собираю темп, звук и акценты — без мёртвых секунд.',
          phoneTitle: 'Ритм держит внимание',
          phoneBody: 'Каждая склейка ведёт зрителя дальше.',
        },
        carousels: {
          title: 'Карусели',
          tags: ['Слайды', 'Структура', 'Подача'],
          description: 'Превращаю мысль в историю, которую хочется долистать.',
          phoneTitle: 'История в нескольких кадрах',
          phoneBody: 'Один тезис — один точный визуальный шаг.',
        },
      },
    },
  },
  en: {
    intro: {
      label: 'About me',
      title: ['I understand the internet', 'from the inside.'],
      body: [
        'Digital designer and creator based in Moscow.',
        'I work with social media, vertical content,',
        'visual systems and AI.',
      ],
      university: 'Financial University / Moscow',
      focus: 'Design · Social · Vertical · AI',
      photoCaption: 'Moscow',
      photoAlt: 'DEGRA beneath an arch of evergreen branches and lights',
    },
    method: {
      title: ['Everything about', 'vertical', 'content'],
      body: 'I help brands and experts speak to their audience in its native language — vertical content.',
      contact: 'Discuss a project',
      navigation: 'Vertical content disciplines',
      phoneLabel: 'Interactive vertical content screen',
      disciplines: {
        copywriting: {
          title: 'Copywriting',
          tags: ['Copy', 'Scripts', 'Structure'],
          description: 'I find the opening line that makes people stop scrolling.',
          phoneTitle: 'Copy that hooks',
          phoneBody: 'Meaning, structure and delivery — from the first second.',
        },
        editing: {
          title: 'Editing',
          tags: ['Reels', 'Shorts', 'TikTok'],
          description: 'I build pace, sound and emphasis — without dead seconds.',
          phoneTitle: 'Rhythm holds attention',
          phoneBody: 'Every cut moves the viewer forward.',
        },
        carousels: {
          title: 'Carousels',
          tags: ['Slides', 'Structure', 'Delivery'],
          description: 'I turn one thought into a story people want to swipe through.',
          phoneTitle: 'A story in several frames',
          phoneBody: 'One point — one precise visual step.',
        },
      },
    },
  },
} as const

const disciplineOrder: DisciplineKey[] = ['copywriting', 'editing', 'carousels']
const disciplinePreviews: Record<DisciplineKey, string> = {
  copywriting: '/assets/about/disciplines/copywriting-v2.png',
  editing: '/assets/about/disciplines/editing-v2.png',
  carousels: '/assets/about/disciplines/carousels-v2.png',
}

const cursorFieldQuery = '(hover: hover) and (pointer: fine) and (min-width: 901px)'

const CursorCardField = lazy(() => import('../components/about/CursorCardField').then((module) => ({
  default: module.CursorCardField,
})))

function DisciplineIcon({ type }: { type: DisciplineKey }) {
  if (type === 'copywriting') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19h4L20 8l-4-4L5 15v4Zm9-13 4 4M5 22h14" /></svg>
  }
  if (type === 'editing') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="m8.5 7.5 11 9.5M8.5 16.5l11-9.5" /></svg>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4-8 4-8-4 8-4Zm-8 9 8 4 8-4M4 17l8 4 8-4" /></svg>
}

export function AboutPage() {
  const { language } = useLanguage()
  const copy = aboutCopy[language]
  const [showCursorField, setShowCursorField] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(cursorFieldQuery).matches
  ))
  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineKey>('copywriting')
  const [pageEntered, setPageEntered] = useState(false)
  const [methodEntered, setMethodEntered] = useState(false)
  const phoneRef = useRef<HTMLDivElement>(null)
  const methodRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.body.classList.add('about-route')
    document.documentElement.classList.add('about-route')
    return () => {
      document.body.classList.remove('about-route')
      document.documentElement.classList.remove('about-route')
    }
  }, [])

  useEffect(() => {
    const query = window.matchMedia(cursorFieldQuery)
    const syncCursorField = () => setShowCursorField(query.matches)

    syncCursorField()
    query.addEventListener('change', syncCursorField)
    return () => query.removeEventListener('change', syncCursorField)
  }, [])

  useEffect(() => {
    let secondFrame = 0
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setPageEntered(true))
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [])

  useEffect(() => {
    const section = methodRef.current
    if (!section) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setMethodEntered(true)
      observer.disconnect()
    }, { threshold: 0.1 })

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const tiltPhone = (event: PointerEvent<HTMLDivElement>) => {
    const phone = phoneRef.current
    if (!phone || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    phone.style.setProperty('--phone-tilt-x', `${(-y * 5).toFixed(2)}deg`)
    phone.style.setProperty('--phone-tilt-y', `${(x * 7).toFixed(2)}deg`)
  }

  const resetPhone = () => {
    const phone = phoneRef.current
    if (!phone) return
    phone.style.setProperty('--phone-tilt-x', '0deg')
    phone.style.setProperty('--phone-tilt-y', '0deg')
  }

  return (
    <main className={`about-page ${pageEntered ? 'is-entered' : ''}`}>
      <section className="about-slide about-intro" aria-labelledby="about-intro-title">
        {showCursorField && (
          <Suspense fallback={null}>
            <CursorCardField language={language} />
          </Suspense>
        )}
        <div className="about-intro-grid">
          <figure className="about-portrait about-entry about-entry--portrait">
            <img src="/assets/about/portrait-night.png" alt={copy.intro.photoAlt} width="960" height="1280" loading="eager" fetchPriority="high" />
            <figcaption>{copy.intro.photoCaption}</figcaption>
          </figure>

          <div className="about-intro-copy about-entry about-entry--copy">
            <p className="about-label">{copy.intro.label}</p>
            <h1 id="about-intro-title">{copy.intro.title.map((line) => <span key={line}>{line}</span>)}</h1>
            <p className="about-body-copy">{copy.intro.body.map((line) => <span key={line}>{line}</span>)}</p>
            <div className="about-facts" aria-label={copy.intro.university}>
              <p>{copy.intro.university}</p>
              <p>{copy.intro.focus}</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={methodRef} id="method" className={`about-slide about-vertical ${methodEntered ? 'is-entered' : ''}`} aria-labelledby="about-method-title">
        <div className="about-vertical-hero">
          <div className="about-vertical-copy about-method-entry about-method-entry--copy">
            <h2 id="about-method-title">{copy.method.title.map((line) => <span key={line}>{line}</span>)}</h2>
            <p>{copy.method.body}</p>
          </div>

          <div className="about-phone-zone about-method-entry about-method-entry--phone" onPointerMove={tiltPhone} onPointerLeave={resetPhone}>
            <div ref={phoneRef} className={`about-phone is-${activeDiscipline}`} aria-label={copy.method.phoneLabel}>
              <img src="/assets/about/vertical-phone-v3.png" alt="" width="1024" height="1536" />
            </div>
          </div>
        </div>

        <div className="about-capability-grid about-method-entry about-method-entry--grid" aria-label={copy.method.navigation}>
          {disciplineOrder.map((key) => {
            const discipline = copy.method.disciplines[key]
            const selected = activeDiscipline === key
            return (
              <button className={`about-capability ${selected ? 'is-active' : ''}`} type="button" key={key} aria-pressed={selected} onClick={() => setActiveDiscipline(key)}>
                <span className="about-capability-heading">
                  <span className="about-capability-icon"><DisciplineIcon type={key} /></span>
                  <strong>{discipline.title}</strong>
                </span>
                <span className="about-capability-tags">{discipline.tags.map((tag) => <span key={tag}>{tag}</span>)}</span>
                <span className="about-capability-preview" aria-hidden="true">
                  <img src={disciplinePreviews[key]} alt="" width="432" height="568" loading="lazy" decoding="async" />
                </span>
                <span className="about-capability-description">{discipline.description}</span>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}
