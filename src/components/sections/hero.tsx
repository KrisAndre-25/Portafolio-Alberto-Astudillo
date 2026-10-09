import { IconChevronDown } from "@tabler/icons-react"
import { motion } from "motion/react"
import { Mountains } from "@/components/decor/mountains"
import { MarqueeButton } from "@/components/ui/marquee-button"
import { siteConfig } from "@/config/site.config"
import { useReducedMotion, useSaveData } from "@/hooks/use-media-query"

const POSTER = "/assets/video/landing-poster.webp"

/** Landing: full-screen looping video (poster only for reduced motion / save-data). */
export function Hero() {
  const reduced = useReducedMotion()
  const saveData = useSaveData()
  const stillOnly = reduced || saveData
  const { hero } = siteConfig

  const enter = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section id="inicio" aria-labelledby="inicio-title" className="relative isolate flex h-dvh min-h-[38rem] w-full flex-col overflow-hidden">
      {stillOnly ? (
        <img src={POSTER} alt="" width={1920} height={1080} fetchPriority="high" className="absolute inset-0 -z-20 size-full object-cover" />
      ) : (
        <video
          className="absolute inset-0 -z-20 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER}
          aria-hidden="true"
        >
          <source src="/assets/video/landing-720.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/assets/video/landing-1080.webm" type="video/webm" />
          <source src="/assets/video/landing-1080.mp4" type="video/mp4" />
        </video>
      )}

      {/* Legibility: green-black wash, heavier at the bottom-left where the text sits. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-overlay via-overlay/55 to-overlay/25 contrast:from-overlay/90 contrast:via-overlay/75 contrast:to-overlay/60" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-overlay/70 via-overlay/20 to-transparent contrast:hidden" />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-[clamp(7rem,16vh,10rem)] sm:px-8">
        <div className="max-w-3xl text-on-media">
          <motion.p className="eyebrow text-sand contrast:text-on-media" {...enter(0.1)}>
            {hero.eyebrow}
          </motion.p>
          <motion.h1 id="inicio-title" className="mt-5 text-display font-medium tracking-tight" {...enter(0.2)}>
            {siteConfig.name}
          </motion.h1>
          <motion.p className="mt-4 font-heading text-h3 italic text-on-media/90" {...enter(0.32)}>
            {siteConfig.role}
          </motion.p>
          <motion.p className="mt-5 max-w-xl text-lead text-on-media/85" {...enter(0.42)}>
            {hero.tagline}
          </motion.p>
          <motion.div className="mt-9 flex flex-wrap gap-3" {...enter(0.54)}>
            <MarqueeButton href={hero.primaryCta.href}>{hero.primaryCta.label}</MarqueeButton>
            <MarqueeButton href={hero.secondaryCta.href} variant="outline">
              {hero.secondaryCta.label}
            </MarqueeButton>
          </motion.div>
        </div>
      </div>

      <a
        href="#sobre-mi"
        data-no-underline
        className="absolute bottom-[clamp(4.5rem,9vh,6rem)] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs tracking-[0.3em] text-on-media/75 uppercase transition-colors hover:text-on-media md:flex"
      >
        Bajar
        <IconChevronDown className="size-5 motion-safe:animate-bounce" aria-hidden="true" />
        <span className="sr-only">a Sobre mí</span>
      </a>

      <Mountains className="absolute inset-x-0 bottom-0" />
    </section>
  )
}
