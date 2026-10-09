import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/**
 * False on the server and during hydration, true afterwards. Lets the
 * pre-rendered HTML and the first client render match exactly, then swap in
 * client-only parts (lazy chunks).
 */
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
