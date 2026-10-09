import { IconArrowsShuffle, IconLayoutGrid } from "@tabler/icons-react"
import { lazy, Suspense, useState } from "react"
import { AnimalDecor } from "@/components/layout/animal-decor"
import { Reveal } from "@/components/layout/reveal"
import { SectionHeading } from "@/components/layout/section-heading"
import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card"
import { certificates, type Certificate } from "@/data/certificates"
import { useCanHover, useReducedMotion } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

const CertificateViewer = lazy(() => import("@/components/sections/certificate-viewer"))

/** Small fixed tilts so the loose cards look dropped on a table. */
const TILTS = [-4, 3, -2, 5, -3, 2, -5, 4, -1, 3, -4, 2, -2]

function CertificateCard({ cert, drag, tilt, onOpen }: { cert: Certificate; drag: boolean; tilt: number; onOpen: () => void }) {
  return (
    <div className="flex justify-center" style={drag ? { transform: `rotate(${tilt}deg)` } : undefined}>
      <DraggableCardBody
        drag={drag}
        onActivate={onOpen}
        label={`Ver certificado: ${cert.title}`}
        className="flex min-h-0 w-full max-w-80 flex-col gap-4 rounded-2xl border border-border p-4 contrast:border-2"
      >
        <div className="pointer-events-none grid aspect-[4/3] place-items-center overflow-hidden rounded-xl bg-paper p-2">
          <img
            src={cert.thumb.sm.src}
            srcSet={`${cert.thumb.sm.src} ${cert.thumb.sm.width}w, ${cert.thumb.md.src} ${cert.thumb.md.width}w`}
            sizes="20rem"
            width={cert.thumb.sm.width}
            height={cert.thumb.sm.height}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="max-h-full w-auto max-w-full object-contain shadow-sm"
          />
        </div>
        <div className="pointer-events-none">
          <h3 className="font-heading text-lg leading-snug">{cert.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {cert.issuer} · {cert.date}
          </p>
        </div>
      </DraggableCardBody>
    </div>
  )
}

export function Certifications() {
  const canHover = useCanHover()
  const reduced = useReducedMotion()
  const [gridChosen, setGridChosen] = useState(false)
  const [open, setOpen] = useState<Certificate | null>(null)
  // The viewer chunk loads on first use and then stays mounted, so closing
  // goes through the dialog's own close (focus return, scroll unlock).
  const [viewerLoaded, setViewerLoaded] = useState(false)
  const show = (cert: Certificate) => {
    setViewerLoaded(true)
    setOpen(cert)
  }
  // Loose, draggable cards only with a mouse and motion allowed; a plain grid otherwise.
  const loose = canHover && !reduced && !gridChosen

  return (
    <section id="certificaciones" aria-labelledby="certificaciones-title" className="relative overflow-hidden border-y border-border bg-card/30 py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <AnimalDecor
          slug="conejo"
          className="mx-auto mb-10 w-32 sm:w-36 lg:absolute lg:top-0 lg:right-10 lg:mb-0 lg:w-40"
        />
        <SectionHeading
          id="certificaciones-title"
          eyebrow="Certificaciones"
          title="Formación que respalda el terreno"
          intro="Título técnico, primeros auxilios en lugares remotos, conservación y voluntariado. Toca una tarjeta para ver el certificado."
        />
        {canHover && !reduced ? (
          <Reveal className="mt-8">
            <button
              type="button"
              onClick={() => setGridChosen((g) => !g)}
              aria-pressed={gridChosen}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm transition-colors hover:bg-muted contrast:border-2"
            >
              {gridChosen ? <IconArrowsShuffle className="size-4" aria-hidden="true" /> : <IconLayoutGrid className="size-4" aria-hidden="true" />}
              {gridChosen ? "Volver a tarjetas sueltas" : "Ordenar en grilla"}
            </button>
            {loose ? <p className="mt-3 text-sm text-muted-foreground">Puedes arrastrar las tarjetas.</p> : null}
          </Reveal>
        ) : null}

        <DraggableCardContainer className={cn("mt-12", loose && "min-h-[40rem]")}>
          <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {certificates.map((cert, i) => (
              <Reveal as="li" key={cert.slug} delay={Math.min(i, 8) * 0.04}>
                <CertificateCard cert={cert} drag={loose} tilt={TILTS[i % TILTS.length]} onOpen={() => show(cert)} />
              </Reveal>
            ))}
          </ul>
        </DraggableCardContainer>
      </div>

      {viewerLoaded ? (
        <Suspense fallback={null}>
          <CertificateViewer cert={open} onClose={() => setOpen(null)} />
        </Suspense>
      ) : null}
    </section>
  )
}
