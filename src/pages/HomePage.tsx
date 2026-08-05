import { CloudWordmarkSection } from '../components/CloudWordmarkSection'
import { ContactFooter } from '../components/ContactFooter'
import { HeroSection } from '../components/HeroSection'
import { SelectedProjectsSection } from '../components/SelectedProjectsSection'
import { ServicesSection } from '../components/ServicesSection'
import { useReveal } from '../hooks/useReveal'

export function HomePage() {
  useReveal()
  return (
    <main>
      <HeroSection />
      <CloudWordmarkSection />
      <SelectedProjectsSection />
      <ServicesSection />
      <ContactFooter />
    </main>
  )
}
