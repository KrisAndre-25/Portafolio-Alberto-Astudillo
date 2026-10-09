import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { FernSprig, NotroFlower } from "@/components/decor/botanicals"
import { AnimalDecor } from "@/components/layout/animal-decor"
import { Reveal } from "@/components/layout/reveal"
import { SectionHeading } from "@/components/layout/section-heading"
import { animals } from "@/data/animals"

// WebGL gallery: its own chunk, loaded only when the section gets close.
const MorphGallery = lazy(() => import("@/components/ui/morph-gallery"))

const items = animals.map((a) => ({
  src: a.image.variants.plate.src,
  thumb: a.image.variants.plateSm.src,
  alt: a.alt,
}))

function useNearViewport<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: "600px 0px" })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, near] as const
}

export function Fauna() {
  const [index, setIndex] = useState(0)
  const [ref, near] = useNearViewport<HTMLDivElement>()
  const current = animals[index]

  return (
    <section id="fauna" aria-labelledby="fauna-title" className="relative overflow-hidden py-24 md:py-32">
      <NotroFlower className="pointer-events-none absolute top-24 right-[6%] hidden w-24 opacity-60 lg:block" />
      <FernSprig className="pointer-events-none absolute bottom-24 left-[3%] hidden w-24 opacity-40 lg:block" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading
          id="fauna-title"
          eyebrow="Fauna"
          title="Cuaderno de campo"
          intro="Algunas de las especies que acompañan el trabajo en parques y senderos, del puma y el cóndor a los pájaros del bosque."
        />
        <AnimalDecor
          slug="aves-lamina"
          shape="hill"
          travel={24}
          className="mx-auto mt-10 w-72 sm:w-96 lg:absolute lg:top-6 lg:right-8 lg:mt-0 lg:w-[26rem] xl:right-16"
        />
      </div>

      <Reveal className="mt-14 px-4 sm:px-8">
        <figure className="mx-auto w-full max-w-[min(100%,calc(70svh*1.6))]">
          <div
            ref={ref}
            className="h-[70svh] max-h-[calc((100vw-2rem)/1.6)] overflow-hidden rounded-3xl border border-border bg-paper contrast:border-2"
          >
            {near ? (
              <Suspense fallback={null}>
                <MorphGallery
                  items={items}
                  height="100%"
                  autoplay={6500}
                  duration={1800}
                  loop
                  index={index}
                  onIndexChange={setIndex}
                  label="Galería de fauna"
                  className="rounded-3xl"
                />
              </Suspense>
            ) : null}
          </div>
          <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1" aria-live="polite">
            <span className="font-heading text-h3">
              {current.name}
              {current.scientific ? <em className="ml-3 text-base text-muted-foreground">{current.scientific}</em> : null}
            </span>
            <span className="text-sm text-muted-foreground">
              {current.credit ? `${current.credit} · ` : ""}
              {index + 1} / {animals.length}
            </span>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  )
}
