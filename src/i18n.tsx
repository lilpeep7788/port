import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'ru' | 'en'

type Copy = {
  header: { role: string; home: string; navigation: string; work: string; about: string; contact: string; openMenu: string; closeMenu: string; switchLanguage: string }
  hero: { kicker: string; heading: [string, string]; description: [string, string] }
  projects: { featured: string; all: string; heading: string; intro: string; openCase: string; openProject: string; preview: string; videoPreview: string; backHome: string }
  case: { back: string; about: string; openSite: string; direction: string; client: string; year: string; role: string; scope: string; result: string; challenge: string; approach: string; caseStudyScope: string; videoPreview: string; demo: string; openFrame: string; gallery: string; closeGallery: string; previous: string; next: string }
  whatIDo: { eyebrow: string; capabilities: [string, string, string, string]; hint: [string, string]; services: string }
  footer: { available: string; capabilities: [string, string, string]; worldwide: string; copyEmail: string; copy: string; copied: string }
}

const copy: Record<Language, Copy> = {
  ru: {
    header: { role: 'Цифровой дизайнер', home: 'DEGRA — на главную', navigation: 'Основная навигация', work: 'Проекты', about: 'Обо мне', contact: 'Обсудить проект', openMenu: 'Открыть меню', closeMenu: 'Закрыть меню', switchLanguage: 'Switch to English' },
    hero: { kicker: 'Привет, я DEGRA', heading: ['Веб-дизайнер и', 'разработчик'], description: ['Создаю сайты, цифровые продукты', 'и визуальные системы.'] },
    projects: { featured: 'Избранные проекты', all: 'Все проекты', heading: 'Проекты', intro: 'Избранные цифровые работы — от бренда и интерфейса до готового сайта.', openCase: 'Открыть кейс', openProject: 'Открыть проект', preview: 'превью проекта', videoPreview: 'видео-превью проекта', backHome: 'К ленте проектов' },
    case: { back: 'Назад', about: 'О проекте', openSite: 'Открыть сайт', direction: 'Направление', client: 'Клиент', year: 'Год', role: 'Роль', scope: 'Задачи', result: 'Результат', challenge: 'Задача', approach: 'Решение', caseStudyScope: 'Что было сделано', videoPreview: 'Видео-превью', demo: 'демонстрация сайта', openFrame: 'Открыть кадр', gallery: 'Галерея', closeGallery: 'Закрыть галерею', previous: 'Предыдущий кадр', next: 'Следующий кадр' },
    whatIDo: { eyebrow: 'Выбранные направления', capabilities: ['Веб-дизайн', 'Разработка', 'Визуальные системы', 'Telegram-боты'], hint: ['Листайте, чтобы посмотреть', 'выбранные направления'], services: 'Услуги и компетенции' },
    footer: { available: 'ОТКРЫТ ДЛЯ РАБОТЫ / 2026', capabilities: ['ВЕБ', 'РАЗРАБОТКА', 'ВИЗУАЛ'], worldwide: 'МОСКВА / ВЕСЬ МИР', copyEmail: 'Скопировать адрес электронной почты', copy: 'КОПИРОВАТЬ', copied: 'СКОПИРОВАНО' },
  },
  en: {
    header: { role: 'Digital designer', home: 'DEGRA — home', navigation: 'Main navigation', work: 'Work', about: 'About', contact: 'Discuss a project', openMenu: 'Open menu', closeMenu: 'Close menu', switchLanguage: 'Переключить на русский' },
    hero: { kicker: "Hello, I'm DEGRA", heading: ['Web designer &', 'developer'], description: ['I create websites, digital products', 'and visual systems.'] },
    projects: { featured: 'Selected projects', all: 'All projects', heading: 'Projects', intro: 'Selected digital work — from brand and interface to a finished website.', openCase: 'Open case study', openProject: 'Open project', preview: 'project preview', videoPreview: 'project video preview', backHome: 'Back to projects' },
    case: { back: 'Back', about: 'About the project', openSite: 'Open website', direction: 'Direction', client: 'Client', year: 'Year', role: 'Role', scope: 'Scope', result: 'Result', challenge: 'Challenge', approach: 'Approach', caseStudyScope: 'Scope', videoPreview: 'Video preview', demo: 'website demo', openFrame: 'Open frame', gallery: 'Gallery', closeGallery: 'Close gallery', previous: 'Previous frame', next: 'Next frame' },
    whatIDo: { eyebrow: 'Selected capabilities', capabilities: ['Web Design', 'Development', 'Visual Systems', 'Telegram Bots'], hint: ['Scroll to explore', 'selected capabilities'], services: 'Services and capabilities' },
    footer: { available: 'AVAILABLE FOR WORK / 2026', capabilities: ['WEB', 'DEVELOPMENT', 'VISUAL'], worldwide: 'MOSCOW / WORLDWIDE', copyEmail: 'Copy email address', copy: 'COPY', copied: 'COPIED' },
  },
}

type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: Copy }
const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => window.localStorage.getItem('degra-language') === 'en' ? 'en' : 'ru')

  useEffect(() => {
    window.localStorage.setItem('degra-language', language)
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, t: copy[language] }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
