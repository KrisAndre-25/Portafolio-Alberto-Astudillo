import { Navbar } from "@/components/layout/navbar"
import { ScrollProgress } from "@/components/layout/scroll-progress"
import { SectionHeading } from "@/components/layout/section-heading"
import { About } from "@/components/sections/about"
import { Hero } from "@/components/sections/hero"
import { Milestones } from "@/components/sections/milestones"
import { Skills } from "@/components/sections/skills"
import { SECTIONS } from "@/config/sections"

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
        {/* Placeholder sections: replaced phase by phase. */}
        {SECTIONS.slice(4).map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="mx-auto min-h-[70svh] max-w-6xl px-4 py-24 sm:px-8">
            <SectionHeading id={`${s.id}-title`} eyebrow="Próximamente" title={s.title} />
          </section>
        ))}
      </main>
    </>
  )
}

export default App
