import { useEffect, useState } from "react"

/**
 * Id of the section currently crossing the middle of the viewport, for the
 * dock's "you are here" state.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? "")

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      // A thin band in the middle of the screen: exactly one section is in it.
      { rootMargin: "-45% 0px -50% 0px" },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
