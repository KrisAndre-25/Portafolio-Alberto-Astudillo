import { IconChevronDown } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { MountainsStatic } from "@/components/decor/mountains-static"
import { FrameButton } from "@/components/ui/frame-button"
import { siteConfig } from "@/config/site.config"
import { useReducedMotion, useSaveData } from "@/hooks/use-media-query"

const POSTER = "/assets/video/landing-poster.webp"

/** Landing: full-screen looping video (poster only for reduced motion / save-data). */
export function Hero() {
  const reduced = useReducedMotion()
  const saveData = useSaveData()
  const stillOnly = reduced || saveData

  // The poster (the video's first frame) paints first; the video only starts
  // downloading once the page has loaded, so it never competes with the text.
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const start = () => setLoaded(true)
    if (document.readyState === "complete") start()
    else window.addEventListener("load", start, { once: true })
    return () => window.removeEventListener("load", start)
  }, [])
  const { hero } = siteConfig

  // Entrance is CSS-only (.hero-enter in index.css): no JS needed to show the
  // text, so it paints early. The h1 only slides, so it counts as painted at once.

  return (
    <section id="inicio" aria-labelledby="inicio-title" className="relative isolate flex h-dvh min-h-[38rem] w-full flex-col overflow-hidden">
      <img
        src={POSTER}
        srcSet={`/assets/video/landing-poster-960.webp 960w, ${POSTER} 1920w`}
        sizes="100vw"
        alt=""
        width={1920}
        height={1080}
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      {stillOnly || !loaded ? null : (
        <video
          className="absolute inset-0 -z-20 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={POSTER}
          aria-hidden="true"
          onLoadedData={(e) => void e.currentTarget.play().catch(() => {})}
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
          <p className="eyebrow text-sand contrast:text-on-media hero-enter" style={{ animationDelay: "0.1s" }}>
            {hero.eyebrow}
          </p>
          <h1 id="inicio-title" className="mt-5 text-display font-medium tracking-tight hero-enter-slide" style={{ animationDelay: "0.2s" }}>
            {siteConfig.name}
          </h1>
          <p className="mt-4 font-heading text-h3 italic text-on-media/90 hero-enter" style={{ animationDelay: "0.32s" }}>
            {siteConfig.role}
          </p>
          <p className="mt-5 max-w-xl text-lead text-on-media/85 hero-enter" style={{ animationDelay: "0.42s" }}>
            {hero.tagline}
          </p>
          <div className="mt-9 flex flex-wrap gap-3 hero-enter" style={{ animationDelay: "0.54s" }}>
            <FrameButton variant="light" href={hero.primaryCta.href}>{hero.primaryCta.label}</FrameButton>
            <FrameButton href={hero.secondaryCta.href} variant="dark">
              {hero.secondaryCta.label}
            </FrameButton>
          </div>
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

      <MountainsStatic className="absolute inset-x-0 bottom-0" />
    </section>
  )
}
