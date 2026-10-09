import { useState } from "react"
import { Mountains } from "@/components/decor/mountains"
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
    srcSet: srcSet(cover.image, ["sm", "md"]),
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
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
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
      <Mountains />

      <Lightbox
        open={open !== null}
        onClose={() => setOpenIndex(null)}
        title={open?.title ?? ""}
        photos={open?.photos ?? []}
      />
    </section>
  )
}
