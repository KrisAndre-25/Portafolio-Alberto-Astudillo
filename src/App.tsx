import { lazy, Suspense } from "react"
import { Navbar } from "@/components/layout/navbar"
import { ScrollProgress } from "@/components/layout/scroll-progress"
import { About } from "@/components/sections/about"
import { Certifications } from "@/components/sections/certifications"
import { Contact } from "@/components/sections/contact"
import { Fauna } from "@/components/sections/fauna"
import { Hero } from "@/components/sections/hero"
import { Milestones } from "@/components/sections/milestones"
import { Skills } from "@/components/sections/skills"

// GSAP + the footer live in their own chunk.
const CinematicFooter = lazy(() => import("@/components/ui/motion-footer"))

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
      {/* The page sits above the fixed footer (curtain reveal): solid background, rounded bottom. */}
      <main className="relative z-10 rounded-b-[2.5rem] bg-background shadow-[0_30px_60px_-20px_oklch(0_0_0/0.6)] contrast:border-b-2 contrast:border-foreground contrast:shadow-none">
        <Hero />
        <About />
        <Skills />
        <Milestones />
        <Fauna />
        <Certifications />
        <Contact />
      </main>
      <Suspense fallback={<div className="h-svh" />}>
        <CinematicFooter />
      </Suspense>
    </>
  )
}

export default App
