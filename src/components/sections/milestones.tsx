import { useState } from "react"
import { Mountains } from "@/components/decor/mountains"
import { AnimalDecor } from "@/components/layout/animal-decor"
import { Reveal } from "@/components/layout/reveal"
import { SectionHeading } from "@/components/layout/section-heading"
import Carousel, { type SlideData } from "@/components/ui/carousel"
import { Lightbox } from "@/components/ui/lightbox"
import { srcSet } from "@/data/images"
import { CATEGORY_LABEL, milestones } from "@/data/milestones"

const slides: SlideData[] = milestones.map((m) => {
  const cover = m.photos[m.cover] ?? m.photos[0]
  const count = m.photos.length
  return {
    title: m.title,
    button: count > 1 ? `Ver ${count} fotos` : "Ver foto",
    src: cover.image.variants.md.src,
    srcSet: srcSet(cover.image, ["sm", "card", "md"]),
    sizes: "min(78vmin, 34rem)",
    alt: cover.alt,
    meta: [CATEGORY_LABEL[m.category], m.date, `${count} ${count === 1 ? "foto" : "fotos"}`].filter(Boolean).join(" · "),
  }
})

export function Milestones() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const open = openIndex === null ? null : milestones[openIndex]

  return (
    <section id="hitos" aria-labelledby="hitos-title" className="relative overflow-hidden pt-24 md:pt-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <AnimalDecor
          slug="puma"
          shape="hill"
          className="mx-auto mb-10 w-44 sm:w-52 lg:absolute lg:top-0 lg:right-12 lg:mb-0 lg:w-64"
        />
        <SectionHeading
          id="hitos-title"
          eyebrow="Hitos"
          title="Kilómetros, cumbres y temporadas"
          intro="Corridas, una cumbre de casi cinco mil metros y la vida diaria en Torres del Paine. Abre cada hito para ver todas sus fotos."
        />
      </div>
      <Reveal className="mt-14 pb-28">
        <Carousel slides={slides} label="Hitos fotográficos" onButtonClick={setOpenIndex} />
      </Reveal>
      <Mountains subtle />

      <Lightbox
        open={open !== null}
        onClose={() => setOpenIndex(null)}
        title={open?.title ?? ""}
        photos={open?.photos ?? []}
        aside={<AnimalDecor slug="picaflor" shape="leaf" travel={0} className="absolute bottom-10 left-8 hidden w-40 2xl:block" />}
      />
    </section>
  )
}
