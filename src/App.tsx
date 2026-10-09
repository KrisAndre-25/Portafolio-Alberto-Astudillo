import { Navbar } from "@/components/layout/navbar"
import { ScrollProgress } from "@/components/layout/scroll-progress"
import { About } from "@/components/sections/about"
import { Certifications } from "@/components/sections/certifications"
import { Contact } from "@/components/sections/contact"
import { Fauna } from "@/components/sections/fauna"
import { Hero } from "@/components/sections/hero"
import { Milestones } from "@/components/sections/milestones"
import { Skills } from "@/components/sections/skills"

function App() {
  return (
    <>
      <a
        href="#sobre-mi"
        className="sr-only z-[80] rounded-full bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Saltar al contenido
      </a>
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10 bg-background">
        <Hero />
        <About />
        <Skills />
        <Milestones />
        <Fauna />
        <Certifications />
        <Contact />
      </main>
    </>
  )
}

export default App
