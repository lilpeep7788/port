export type ProjectSlug = 'carpaccio' | 'vault-77' | 'level-h2o' | 'aurelia'

export type Project = {
  slug: ProjectSlug
  title: string
  year: string
  category: string
  theme: 'dark' | 'mixed'
  summary: string
  role: string
  scope: string
  deliverables: string
  caseStudy: {
    challenge?: string
    approach?: string
    scope?: string
  }
  liveUrl: string
  featured?: boolean
  previewVideo?: string
  homeColumns: string
  homeImages: string[]
  caseImages: string[]
}

export type LocalizedProject = Pick<Project, 'category' | 'summary' | 'role' | 'scope' | 'deliverables' | 'caseStudy'>

const asset = (project: string, file: string) => `/assets/projects/${project}/${file}`

export const projects: Project[] = [
  {
    slug: 'carpaccio',
    title: 'Carpaccio',
    year: '2026',
    category: 'Веб-дизайн',
    theme: 'dark',
    summary:
      'Смелый цифровой образ петербургской кофейни, где спортивные автомобили, ночная культура и гостеприимство складываются в единую узнаваемую атмосферу.',
    role: 'Цифровой дизайн',
    scope: 'Стратегия · UX · UI',
    deliverables: 'Сайт · Арт-дирекшн',
    caseStudy: {
      challenge: 'Сформировать цельный цифровой образ петербургской кофейни, объединяющий спортивные автомобили, ночную культуру и гостеприимство.',
      approach: 'Стратегия, UX и UI собраны в единую атмосферную систему с арт-дирекшном проекта.',
      scope: 'Стратегия · UX · UI · Веб-дизайн · Арт-дирекшн.',
    },
    liveUrl: 'https://carpaccio.spb.ru/',
    featured: true,
    homeColumns: '1.99fr 1.99fr 1fr',
    homeImages: [
      asset('carpaccio', '01-laptop-hero.png'),
      asset('carpaccio', '02-about-story.png'),
      asset('carpaccio', '03-guests-gallery.png'),
    ],
    caseImages: [
      asset('carpaccio', '01-laptop-hero.png'),
      asset('carpaccio', '02-about-story.png'),
      asset('carpaccio', '03-guests-gallery.png'),
      asset('carpaccio', '04-cars-catalog.png'),
      asset('carpaccio', '05-photoshoot-faq.png'),
      asset('carpaccio', '06-menu.png'),
      asset('carpaccio', '07-interior-triptych.png'),
    ],
  },
  {
    slug: 'vault-77',
    title: 'Vault 77',
    year: '2026',
    category: 'Веб-дизайн',
    theme: 'mixed',
    summary:
      'Выверенная редакционная платформа для реставрационной студии, посвященной классическим автомобилям, точной ручной работе и историям, которые хранит каждая машина.',
    role: 'Цифровой дизайн',
    scope: 'UX · UI · Арт-дирекшн',
    deliverables: 'Сайт · Дизайн-система',
    caseStudy: {
      challenge: 'Создать редакционную платформу для реставрационной студии, посвящённой классическим автомобилям, ручной работе и историям машин.',
      approach: 'UX, UI и арт-дирекшн выстроены вокруг точной подачи процессов, специализации и проектов студии.',
      scope: 'UX · UI · Арт-дирекшн · Сайт · Дизайн-система.',
    },
    liveUrl: 'https://degra-vault77.vercel.app/',
    featured: true,
    homeColumns: '1.48fr 1.68fr 1fr',
    homeImages: [
      asset('vault77', '01-laptop-hero.png'),
      asset('vault77', '02-specialization.png'),
      asset('vault77', '03-projects-overview.png'),
    ],
    caseImages: [
      asset('vault77', '01-laptop-hero.png'),
      asset('vault77', '02-specialization.png'),
      asset('vault77', '03-projects-overview.png'),
      asset('vault77', '04-services-process-list.png'),
      asset('vault77', '05-process-diagnostics.png'),
      asset('vault77', '06-porsche-carrera-hero.png'),
      asset('vault77', '07-project-grid.png'),
      asset('vault77', '08-project-form.png'),
    ],
  },
  {
    slug: 'level-h2o',
    title: 'Level-H2O',
    year: '2026',
    category: 'Веб-дизайн',
    theme: 'dark',
    summary:
      'Точный контрастный интернет-магазин, который превращает сложную технологию ионизации воды в понятную и убедительную историю продукта.',
    role: 'Цифровой дизайн',
    scope: 'UX · UI · Интернет-магазин',
    deliverables: 'Сайт · Продуктовая система',
    caseStudy: {
      challenge: 'Сделать сложную технологию ионизации воды понятной частью продуктовой истории интернет-магазина.',
      approach: 'Контрастная UX/UI-система последовательно раскрывает продукты, преимущества, сравнение и установку.',
      scope: 'UX · UI · Интернет-магазин · Сайт · Продуктовая система.',
    },
    liveUrl: 'https://level-h20.ru/',
    featured: true,
    homeColumns: '1.28fr 1.34fr 1fr',
    homeImages: [
      asset('level-h2o', '01-laptop-hero.png'),
      asset('level-h2o', '02-water-health.png'),
      asset('level-h2o', '03-biontech-product.png'),
    ],
    caseImages: [
      asset('level-h2o', '01-laptop-hero.png'),
      asset('level-h2o', '02-water-health.png'),
      asset('level-h2o', '03-biontech-product.png'),
      asset('level-h2o', '04-genesis-product.png'),
      asset('level-h2o', '05-biontech-installation.png'),
      asset('level-h2o', '06-benefits.png'),
      asset('level-h2o', '07-comparison-table.png'),
      asset('level-h2o', '08-faq.png'),
    ],
  },
  {
    slug: 'aurelia',
    title: 'AURELIA',
    year: '2026',
    category: 'Веб-дизайн',
    theme: 'mixed',
    summary:
      'Воздушный цифровой образ архитектурной студии полного цикла. Спокойная типографика, крупная визуальная подача проектов и ясный путь от знакомства со студией до заявки.',
    role: 'Цифровой дизайн',
    scope: 'Стратегия · UX · UI',
    deliverables: 'Лендинг · Арт-дирекшн',
    caseStudy: {
      challenge: 'Создать цифровой образ архитектурной студии полного цикла и ясный путь от знакомства до заявки.',
      approach: 'Спокойная типографика и крупная визуальная подача объединяют проекты, услуги, подход и студию.',
      scope: 'Стратегия · UX · UI · Лендинг · Арт-дирекшн.',
    },
    liveUrl: 'https://fururism.vercel.app/',
    previewVideo: asset('aurelia', 'aurelia-preview.mp4'),
    homeColumns: '1.55fr 1.25fr 1fr',
    homeImages: [
      asset('aurelia', '01-hero.png'),
      asset('aurelia', '02-projects.png'),
      asset('aurelia', '03-intro.png'),
    ],
    caseImages: [
      asset('aurelia', '01-hero.png'),
      asset('aurelia', '02-projects.png'),
      asset('aurelia', '03-intro.png'),
      asset('aurelia', '04-services.png'),
      asset('aurelia', '05-approach.png'),
      asset('aurelia', '06-studio.png'),
      asset('aurelia', '07-project-modal.png'),
      asset('aurelia', '08-contact.png'),
    ],
  },
]

export const getProject = (slug?: string) => projects.find((project) => project.slug === slug)

const englishProjectCopy: Record<ProjectSlug, LocalizedProject> = {
  carpaccio: {
    category: 'Web design',
    summary: 'A bold digital identity for a St. Petersburg coffee shop, where sports cars, night culture, and hospitality create one recognisable atmosphere.',
    role: 'Digital design',
    scope: 'Strategy · UX · UI',
    deliverables: 'Website · Art direction',
    caseStudy: {
      challenge: 'Create a cohesive digital identity for a St. Petersburg coffee shop shaped by sports cars, night culture, and hospitality.',
      approach: 'Strategy, UX, and UI form one atmospheric system supported by the project art direction.',
      scope: 'Strategy · UX · UI · Web design · Art direction.',
    },
  },
  'vault-77': {
    category: 'Web design',
    summary: 'A considered editorial platform for a restoration studio devoted to classic cars, precise craft, and the stories preserved by every vehicle.',
    role: 'Digital design',
    scope: 'UX · UI · Art direction',
    deliverables: 'Website · Design system',
    caseStudy: {
      challenge: 'Create an editorial platform for a restoration studio focused on classic cars, precise craft, and the stories behind each vehicle.',
      approach: 'UX, UI, and art direction organise the studio processes, expertise, and projects into a precise narrative.',
      scope: 'UX · UI · Art direction · Website · Design system.',
    },
  },
  'level-h2o': {
    category: 'Web design',
    summary: 'A precise, high-contrast e-commerce experience that turns complex water-ionisation technology into a clear and convincing product story.',
    role: 'Digital design',
    scope: 'UX · UI · E-commerce',
    deliverables: 'Website · Product system',
    caseStudy: {
      challenge: 'Make complex water-ionisation technology a clear part of an e-commerce product story.',
      approach: 'A high-contrast UX/UI system guides users through products, benefits, comparisons, and installation.',
      scope: 'UX · UI · E-commerce · Website · Product system.',
    },
  },
  aurelia: {
    category: 'Web design',
    summary: 'An airy digital identity for a full-service architecture studio: calm typography, generous project storytelling, and a clear path from discovery to enquiry.',
    role: 'Digital design',
    scope: 'Strategy · UX · UI',
    deliverables: 'Landing page · Art direction',
    caseStudy: {
      challenge: 'Create a digital identity for a full-service architecture studio and a clear path from discovery to enquiry.',
      approach: 'Calm typography and generous imagery connect the studio projects, services, approach, and profile.',
      scope: 'Strategy · UX · UI · Landing page · Art direction.',
    },
  },
}

export const getLocalizedProject = (project: Project, language: 'ru' | 'en'): LocalizedProject =>
  language === 'en' ? englishProjectCopy[project.slug] : project
