import { useEffect, useRef } from "react"
import type * as React from "react"

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Seconds. Keep small: siblings use 0, 0.04, 0.08… */
  delay?: number
  as?: "div" | "li" | "article" | "header"
}

// One observer for every revealed element on the page (cheaper than one each).
let observer: IntersectionObserver | null = null
const getObserver = () =>
  (observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute("data-revealed", "")
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: "0px 0px -12% 0px" },
  ))

/**
 * Fades and lifts its content in once, when it first enters the viewport.
 * CSS does the motion (`.reveal` in index.css); reduced motion shows it as is.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = getObserver()
    io.observe(el)
    return () => io.unobserve(el)
  }, [])

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className ? `reveal ${className}` : "reveal"}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
