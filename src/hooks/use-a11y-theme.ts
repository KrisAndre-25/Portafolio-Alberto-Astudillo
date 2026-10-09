import { useCallback, useSyncExternalStore } from "react"

/**
 * High-contrast / colour-blind theme toggle. The initial value is applied by
 * an inline script in index.html (no flash); this hook keeps React in sync.
 */
export const THEME_STORAGE_KEY = "aa-theme"
const ATTR = "data-a11y"

const listeners = new Set<() => void>()

const read = () => document.documentElement.getAttribute(ATTR) === "contrast"

export function setContrastTheme(on: boolean) {
  const root = document.documentElement
  if (on) root.setAttribute(ATTR, "contrast")
  else root.removeAttribute(ATTR)
  try {
    localStorage.setItem(THEME_STORAGE_KEY, on ? "contrast" : "natural")
  } catch {
    // Storage can be unavailable (private mode); the toggle still works for this visit.
  }
  listeners.forEach((l) => l())
}

export function useA11yTheme() {
  const contrast = useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange)
      return () => listeners.delete(onChange)
    },
    read,
    () => false,
  )
  const toggle = useCallback(() => setContrastTheme(!read()), [])
  return { contrast, toggle }
}
