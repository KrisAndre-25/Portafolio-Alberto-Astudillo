import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { animals } from "@/data/animals"
import { cn } from "@/lib/utils"

/** Organic outlines: a river stone, a leaf and a hillside. */
const SHAPES = {
  stone: "63% 37% 54% 46% / 55% 48% 52% 45%",
  leaf: "8% 92% 10% 90% / 90% 12% 88% 10%",
  hill: "50% 50% 12% 12% / 70% 70% 10% 10%",
} as const

type AnimalDecorProps = {
  slug: string
  shape?: keyof typeof SHAPES
  /** Position/size classes. Mobile: in the flow; lg+: usually absolute in a side gutter. */
  className?: string
  /** Parallax travel in px (0 for none). */
  travel?: number
  /** Flip horizontally so the animal faces into the page. */
  flip?: boolean
}

/**
 * Decorative animal illustration on an organic, softly lit backdrop with a
 * fine border. Purely ornamental (aria-hidden): the Fauna section carries the
 * descriptive text for every image.
 */
export function AnimalDecor({ slug, shape = "stone", className, travel = 40, flip = false }: AnimalDecorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [travel, -travel])
  const animal = animals.find((a) => a.slug === slug)
  if (!animal) return null
  const img = animal.image.variants.cutout

  return (
    <motion.div ref={ref} style={{ y }} aria-hidden="true" className={cn("pointer-events-none relative select-none", className)}>
      <div
        className="absolute inset-[6%_4%_0_4%] border border-sand/25 bg-[radial-gradient(circle_at_35%_30%,color-mix(in_oklch,var(--sand)_22%,transparent),color-mix(in_oklch,var(--moss)_10%,transparent)_70%)] shadow-[var(--shadow-soft)] contrast:border-foreground contrast:bg-muted"
        style={{ borderRadius: SHAPES[shape] }}
      />
      <img
        src={img.src}
        width={img.width}
        height={img.height}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn("relative w-full drop-shadow-[0_14px_18px_oklch(0.1_0.02_160/0.45)] contrast:grayscale", flip && "-scale-x-100")}
      />
    </motion.div>
  )
}
