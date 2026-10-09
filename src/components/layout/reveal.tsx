import { motion, useReducedMotion } from "motion/react"
import type * as React from "react"

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Seconds. Keep small: siblings use 0, 0.08, 0.16… */
  delay?: number
  as?: "div" | "li" | "article" | "header"
}

/** Fades and lifts its content in once, when it first enters the viewport. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduced = useReducedMotion()
  const Component = motion[as]
  if (reduced) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
