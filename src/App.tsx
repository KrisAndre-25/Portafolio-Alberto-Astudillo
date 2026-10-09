import { lazy, startTransition, Suspense, useEffect, useState } from "react"
import { Hero } from "@/components/sections/hero"
import { useHydrated } from "@/hooks/use-hydrated"

// The first screen (hero) ships in the main bundle; everything else, including
// the animation library, GSAP and the WebGL gallery, comes in later chunks.
const Chrome = lazy(() => import("@/components/layout/chrome"))
const BelowFold = lazy(() => import("@/components/sections/below-fold"))
const CinematicFooter = lazy(() => import("@/components/ui/motion-footer"))

function App() {
  // Server and hydration render the placeholders. The rest of the page then
  // mounts in an idle moment, as a transition, so React renders it in small
  // slices instead of one long task that would block taps and scrolling.
  const isHydrated = useHydrated()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    if (!isHydrated) return
    const show = () => startTransition(() => setHydrated(true))
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(show, { timeout: 600 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(show, 1)
    return () => clearTimeout(id)
  }, [isHydrated])
  return (
    <>
      <a
        href="#sobre-mi"
        className="sr-only z-[80] rounded-full bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Saltar al contenido
      </a>
      {hydrated ? (
        <Suspense fallback={null}>
          <Chrome />
        </Suspense>
      ) : null}
      {/* The page sits above the fixed footer (curtain reveal): solid background, rounded bottom. */}
      <main className="relative z-10 rounded-b-[2.5rem] bg-background shadow-[0_30px_60px_-20px_oklch(0_0_0/0.6)] contrast:border-b-2 contrast:border-foreground contrast:shadow-none">
        <Hero />
        {hydrated ? (
          <Suspense fallback={<div className="min-h-svh" />}>
            <BelowFold />
          </Suspense>
        ) : (
          <div className="min-h-svh" />
        )}
      </main>
      {hydrated ? (
        <Suspense fallback={<div className="h-svh" />}>
          <CinematicFooter />
        </Suspense>
      ) : (
        <div className="h-svh" />
      )}
    </>
  )
}

export default App
