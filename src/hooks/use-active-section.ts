import { useEffect, useState } from "react"

/**
 * Id of the current section: the last one whose top has passed the middle of
 * the viewport. Computed on scroll (once per frame), so it stays right after
 * instant jumps and in the footer, where no section crosses the middle.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? "")

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.45
      let current = ids[0] ?? ""
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    // Sections mount lazily after hydration: re-check when the DOM grows.
    const mo = new MutationObserver(onScroll)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      mo.disconnect()
    }
  }, [ids])

  return active
}
