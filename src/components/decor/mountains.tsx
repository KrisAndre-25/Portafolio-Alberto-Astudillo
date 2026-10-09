import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * Layered cordillera silhouettes, drawn by hand as SVG paths (towers and
 * horns inspired by the Paine massif). The back layers drift a little slower
 * than the page for a soft parallax; static for reduced motion.
 * The front layer is filled with the page background so a section blends
 * into the next one.
 */
export function Mountains({ className, flip = false }: { className?: string; flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const back = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-28, 28])
  const mid = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-14, 14])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none relative h-[clamp(6rem,14vw,12rem)] w-full overflow-hidden", flip && "-scale-y-100", className)}
    >
      <motion.svg style={{ y: back }} className="absolute inset-x-0 bottom-0 h-full w-full" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path
          d="M0 200V128l70-22 64 14 58-40 46 26 40-58 28 18 30-62 22 30 18-38 26 52 34-24 50 46 60-18 70 30 64-50 58 20 46-36 52 40 70-12 64 32 54-28 60 20 72-36 64 30 58-14 70 26 56-20 50 18V200Z"
          className="fill-glacier/[0.07] contrast:fill-foreground/10"
        />
      </motion.svg>
      <motion.svg style={{ y: mid }} className="absolute inset-x-0 bottom-0 h-full w-full" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path
          d="M0 200V150l90-20 70 18 80-44 60 30 52-22 44 12 40-70 14 18 18-46 16 30 20-40 22 64 30-10 48 38 76-22 82 28 70-30 64 18 80-26 90 34 72-22 80 20 66-18 84 26V200Z"
          className="fill-moss/[0.13] contrast:fill-foreground/20"
        />
      </motion.svg>
      <svg className="absolute inset-x-0 bottom-0 h-full w-full" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path
          d="M0 200V172l110-14 90 12 120-26 100 18 90-10 110 20 120-24 110 14 100-12 120 22 110-16 100 10 160-8V200Z"
          className="fill-background"
        />
      </svg>
    </div>
  )
}
