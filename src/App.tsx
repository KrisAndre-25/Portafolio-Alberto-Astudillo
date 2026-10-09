import { ScrollProgress } from "@/components/layout/scroll-progress"
import { SectionHeading } from "@/components/layout/section-heading"
import { MarqueeButton } from "@/components/ui/marquee-button"
import { siteConfig } from "@/config/site.config"
import { setContrastTheme, useA11yTheme } from "@/hooks/use-a11y-theme"

// Temporary shell: sections are added phase by phase.
function App() {
  const { contrast } = useA11yTheme()
  return (
    <>
      <ScrollProgress />
      <main className="mx-auto grid min-h-[200dvh] max-w-5xl content-start gap-10 px-4 py-24">
        <section id="inicio" aria-labelledby="inicio-title">
          <SectionHeading id="inicio-title" eyebrow={siteConfig.hero.eyebrow} title={siteConfig.name} intro={siteConfig.hero.tagline} />
          <div className="mt-8 flex flex-wrap gap-4">
            <MarqueeButton href={siteConfig.hero.primaryCta.href}>{siteConfig.hero.primaryCta.label}</MarqueeButton>
            <MarqueeButton variant="ghost" onClick={() => setContrastTheme(!contrast)}>
              {contrast ? "Tema natural" : "Alto contraste"}
            </MarqueeButton>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
