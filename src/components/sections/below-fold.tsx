import { useEffect } from "react"
import { About } from "@/components/sections/about"
import { Certifications } from "@/components/sections/certifications"
import { Contact } from "@/components/sections/contact"
import { Experience } from "@/components/sections/experience"
import { Fauna } from "@/components/sections/fauna"
import { Milestones } from "@/components/sections/milestones"
import { Skills } from "@/components/sections/skills"

/**
 * Every section after the hero, in one lazily loaded chunk (with the
 * animation library), so the first screen paints from a small bundle.
 */
export default function BelowFold() {
  // Deep links (/#hitos) arrive before these sections exist: honour them once mounted.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id && id !== "inicio") document.getElementById(id)?.scrollIntoView({ behavior: "instant" })
  }, [])

  return (
    <>
      <About />
      <Experience />
      <Skills />
      <Milestones />
      <Fauna />
      <Certifications />
      <Contact />
    </>
  )
}
