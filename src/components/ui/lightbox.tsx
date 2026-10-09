import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { useEffect, useRef, useState } from "react"
import { ModalDialog } from "@/components/ui/modal-dialog"
import { srcSet, type ImageEntry } from "@/data/images"

export type LightboxPhoto = { image: ImageEntry; alt: string }

type LightboxProps = {
  open: boolean
  onClose: () => void
  title: string
  photos: LightboxPhoto[]
  aside?: React.ReactNode
}

/** Photo viewer: ←/→ and swipe to move, Esc to close, "n / N" counter. */
export function Lightbox({ open, onClose, title, photos, aside }: LightboxProps) {
  const [index, setIndex] = useState(0)
  const swipe = useRef<number | null>(null)
  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setIndex(0)
  }

  const n = photos.length
  const go = (i: number) => setIndex(((i % n) + n) % n)

  useEffect(() => {
    if (!open || n < 2) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % n)
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + n) % n)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, n])

  const photo = photos[index]
  const next = photos[(index + 1) % n]

  const arrow =
    "absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-on-media/30 bg-overlay/60 text-on-media backdrop-blur-md transition-colors hover:bg-on-media hover:text-overlay contrast:border-2"

  return (
    <ModalDialog open={open} onClose={onClose} title={title} showTitle aside={aside} className="max-w-6xl">
      {photo ? (
        <figure
          className="relative flex min-h-0 flex-1 flex-col"
          onPointerDown={(e) => (swipe.current = e.clientX)}
          onPointerUp={(e) => {
            if (swipe.current === null) return
            const dx = e.clientX - swipe.current
            swipe.current = null
            if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1))
          }}
          style={{ touchAction: "pan-y" }}
        >
          <img
            key={photo.image.variants.lg.src}
            src={photo.image.variants.lg.src}
            srcSet={srcSet(photo.image)}
            sizes="(min-width: 1200px) 72rem, 100vw"
            width={photo.image.width}
            height={photo.image.height}
            alt={photo.alt}
            decoding="async"
            draggable={false}
            className="mx-auto max-h-[calc(100dvh-9rem)] w-auto max-w-full rounded-2xl object-contain motion-safe:animate-in motion-safe:fade-in"
          />
          {/* Warm the next photo so moving forward feels instant. */}
          {next && next !== photo ? <link rel="prefetch" as="image" href={next.image.variants.lg.src} /> : null}
          <figcaption className="mt-3 flex items-start justify-between gap-4 text-sm text-on-media/85">
            <span>{photo.alt}</span>
            <span className="shrink-0 tabular-nums" aria-live="polite">
              {index + 1} / {n}
            </span>
          </figcaption>
          {n > 1 ? (
            <>
              <button type="button" className={`${arrow} left-2`} onClick={() => go(index - 1)} aria-label="Foto anterior">
                <IconChevronLeft aria-hidden="true" />
              </button>
              <button type="button" className={`${arrow} right-2`} onClick={() => go(index + 1)} aria-label="Foto siguiente">
                <IconChevronRight aria-hidden="true" />
              </button>
            </>
          ) : null}
        </figure>
      ) : null}
    </ModalDialog>
  )
}
