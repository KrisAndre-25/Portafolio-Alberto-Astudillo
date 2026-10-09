import { motion, useScroll, useSpring } from "motion/react"
import { SECTIONS } from "@/config/sections"
import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"

const IDS = SECTIONS.map((s) => s.id)

/**
 * Minimal section rail on the right edge (lg+): a hairline that fills with
 * scroll, one tick per section and the current section number; names appear
 * in a pill on hover/focus so the rail never covers content.
 * Ticks are links, so it doubles as keyboard navigation. Native scrolling only.
 */
export function SectionRail() {
  const active = useActiveSection(IDS)
  const { scrollYProgress } = useScroll()
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  const activeIndex = Math.max(0, IDS.indexOf(active as (typeof IDS)[number]))

  return (
    <nav aria-label="Secciones" className="fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 lg:block xl:right-5">
      <div className="relative flex flex-col items-end gap-5 py-1">
        {/* hairline + scroll fill */}
        <span aria-hidden="true" className="absolute top-0 right-[5px] h-full w-px bg-border" />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: fill }}
          className="absolute top-0 right-[5px] h-full w-px origin-top bg-sand contrast:bg-foreground"
        />
        {SECTIONS.map((s, i) => {
          const isActive = i === activeIndex
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-no-underline
              aria-current={isActive ? "location" : undefined}
              className="group relative flex items-center gap-3 py-0.5 text-right"
            >
              {/* Number of the current section; the name shows on hover/focus in a pill. */}
              <span
                className={cn(
                  "font-heading text-[11px] tracking-[0.18em] text-sand tabular-nums transition-opacity duration-300 contrast:text-foreground",
                  isActive ? "opacity-100" : "opacity-0",
                  "group-hover:opacity-0 group-focus-visible:opacity-0",
                )}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pointer-events-none absolute right-6 translate-x-2 rounded-full border border-border bg-background/90 px-3 py-1 text-xs tracking-[0.16em] whitespace-nowrap uppercase opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 contrast:border-foreground">
                <span className="mr-2 text-sand tabular-nums contrast:text-foreground">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 block rounded-full border transition-all duration-300",
                  isActive
                    ? "size-[11px] border-sand bg-sand contrast:border-foreground contrast:bg-foreground"
                    : "size-[7px] mr-[2px] border-muted-foreground/60 bg-background group-hover:border-foreground",
                )}
              />
            </a>
          )
        })}
      </div>
    </nav>
  )
}
