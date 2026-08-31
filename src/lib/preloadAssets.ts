import type { Project } from '../data/projects'

type PreloadPriority = 'high' | 'low'

const preloadedImages = new Map<string, HTMLImageElement>()

export function preloadImage(src: string, priority: PreloadPriority = 'low') {
  if (typeof window === 'undefined') return

  const existingImage = preloadedImages.get(src)
  if (existingImage) {
    if (priority === 'high') existingImage.fetchPriority = 'high'
    return
  }

  const image = new Image()
  image.decoding = 'async'
  image.fetchPriority = priority
  image.src = src
  preloadedImages.set(src, image)
}

export function preloadProjectAssets(project: Project) {
  project.caseImages.slice(0, 2).forEach((src, index) => preloadImage(src, index === 0 ? 'high' : 'low'))
}

export function preloadProjectsIndexAssets(projects: Project[], priority: PreloadPriority = 'low') {
  projects.forEach((project) => {
    preloadImage(project.homeImages[0], priority)
  })
}
