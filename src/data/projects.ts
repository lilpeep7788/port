export type ProjectSlug = 'carpaccio' | 'vault-77' | 'level-h2o'

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
  homeColumns: string
  homeImages: string[]
  caseImages: string[]
}

const asset = (project: string, file: string) => `/assets/projects/${project}/${file}`

export const projects: Project[] = [
  {
    slug: 'carpaccio',
    title: 'Carpaccio',
    year: '2026',
    category: 'Webdesign',
    theme: 'dark',
    summary:
      'A bold digital home for a Saint Petersburg coffee house where sports cars, late-night culture, and hospitality share one unmistakable atmosphere.',
    role: 'Digital design',
    scope: 'Strategy · UX · UI',
    deliverables: 'Website · Art direction',
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
    category: 'Webdesign',
    theme: 'mixed',
    summary:
      'A disciplined editorial platform for a restoration studio devoted to classic automobiles, careful craft, and the stories held in every machine.',
    role: 'Digital design',
    scope: 'UX · UI · Direction',
    deliverables: 'Website · Design system',
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
    category: 'Webdesign',
    theme: 'dark',
    summary:
      'A precise, high-contrast commerce experience that turns advanced water-ionisation technology into a clear and credible product story.',
    role: 'Digital design',
    scope: 'UX · UI · Commerce',
    deliverables: 'Website · Product system',
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
]

export const getProject = (slug?: string) => projects.find((project) => project.slug === slug)
