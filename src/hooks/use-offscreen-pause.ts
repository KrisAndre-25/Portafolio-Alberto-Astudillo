import { useEffect } from "react"

/**
 * Pauses CSS animations of an element while it is off screen: sets
 * `data-offscreen` on `target` (default: the observed element), and index.css
 * stops every animation inside it. `onChange` lets callers pause other work
 * (a video, a JS loop) too.
 */
export function useOffscreenPause(
  ref: React.RefObject<HTMLElement | null>,
  { target, onChange, margin = "100px" }: { target?: () => HTMLElement | null; onChange?: (visible: boolean) => void; margin?: string } = {},
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        const t = target?.() ?? el
        if (visible) t.removeAttribute("data-offscreen")
        else t.setAttribute("data-offscreen", "")
        onChange?.(visible)
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, margin])
}
