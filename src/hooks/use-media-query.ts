import { useSyncExternalStore } from "react"

/** Live result of a CSS media query. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener("change", onChange)
      return () => mq.removeEventListener("change", onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)")

/** True on devices whose primary pointer can hover (mouse, trackpad). */
export const useCanHover = () => useMediaQuery("(hover: hover) and (pointer: fine)")

type NetworkInformation = { saveData?: boolean }

/** True when the visitor asked the browser to save data. */
export function useSaveData(): boolean {
  const viaQuery = useMediaQuery("(prefers-reduced-data: reduce)")
  if (typeof navigator === "undefined") return viaQuery
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  return viaQuery || Boolean(connection?.saveData)
}
