import { CloudWordmarkSection } from '../components/CloudWordmarkSection'
import { ContactFooter } from '../components/ContactFooter'
import { HeroSection } from '../components/HeroSection'
import { SelectedProjectsSection } from '../components/SelectedProjectsSection'
import { useReveal } from '../hooks/useReveal'

export function HomePage() {
  useReveal()
  return (
    <main>
      <HeroSection />
      <CloudWordmarkSection />
      <SelectedProjectsSection />
      <ContactFooter />
    </main>
  )
}
