import { motion, useScroll, useSpring } from "motion/react"

/** Thin reading-progress line along the top edge (moss to sand). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-linear-to-r from-moss via-sand to-glacier contrast:bg-foreground"
      style={{ scaleX }}
    />
  )
}
