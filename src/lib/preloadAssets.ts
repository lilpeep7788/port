import type { Project } from '../data/projects'

type PreloadPriority = 'high' | 'low'

const preloadedImages = new Map<string, HTMLImageElement>()
const preloadedVideos = new Map<string, HTMLVideoElement>()

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

export function preloadVideo(src: string) {
  if (typeof document === 'undefined' || preloadedVideos.has(src)) return

  const video = document.createElement('video')
  video.preload = 'auto'
  video.muted = true
  video.playsInline = true
  video.src = src
  video.load()
  preloadedVideos.set(src, video)
}

export function preloadProjectAssets(project: Project) {
  project.caseImages.forEach((src, index) => preloadImage(src, index < 2 ? 'high' : 'low'))
  if (project.previewVideo) preloadVideo(project.previewVideo)
}

export function preloadProjectsIndexAssets(projects: Project[], priority: PreloadPriority = 'low') {
  projects.forEach((project) => {
    preloadImage(project.homeImages[0], priority)
    if (project.previewVideo) preloadVideo(project.previewVideo)
  })
}
