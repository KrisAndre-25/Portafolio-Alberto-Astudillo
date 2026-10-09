import { IconDownload, IconExternalLink } from "@tabler/icons-react"
import { AnimalDecor } from "@/components/layout/animal-decor"
import { MarqueeButton } from "@/components/ui/marquee-button"
import { ModalDialog } from "@/components/ui/modal-dialog"
import type { Certificate } from "@/data/certificates"
import { useMediaQuery } from "@/hooks/use-media-query"

/**
 * Certificate modal: the PDF inline on wide screens (with an image fallback
 * for browsers without a PDF viewer), the rendered first page on phones,
 * where inline PDFs rarely work. Always offers download and new-tab links.
 * Lazy-loaded from the Certifications section.
 */
export default function CertificateViewer({ cert, onClose }: { cert: Certificate | null; onClose: () => void }) {
  const wide = useMediaQuery("(min-width: 768px)")
  const preview = cert ? (
    <img
      src={cert.thumb.md.src}
      width={cert.thumb.md.width}
      height={cert.thumb.md.height}
      alt={`Vista previa del certificado: ${cert.title}`}
      className="mx-auto max-h-full w-auto max-w-full rounded-xl bg-paper object-contain"
    />
  ) : null

  return (
    <ModalDialog
      open={cert !== null}
      onClose={onClose}
      title={cert?.title ?? ""}
      showTitle
      className="max-w-5xl"
      aside={<AnimalDecor slug="abejaruco" shape="leaf" travel={0} className="absolute top-24 right-8 hidden w-44 2xl:block" />}
    >
      {cert ? (
        <>
          <p className="-mt-1 mb-3 text-sm text-on-media/80">
            {[cert.issuer, cert.date, cert.hours].filter(Boolean).join(" · ")}
          </p>
          <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-on-media/20 bg-paper">
            {cert.type === "pdf" && wide ? (
              <object data={`${cert.file}#view=FitH`} type="application/pdf" aria-label={cert.title} className="block h-[min(72dvh,52rem)] w-full">
                <div className="grid h-full place-items-center p-4">{preview}</div>
              </object>
            ) : cert.type === "image" ? (
              <img src={cert.file} alt={cert.title} className="mx-auto max-h-[72dvh] w-auto object-contain" />
            ) : (
              <div className="grid max-h-[65dvh] place-items-center overflow-auto p-3">{preview}</div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <MarqueeButton href={cert.file} download icon={<IconDownload />}>
              Descargar
            </MarqueeButton>
            <MarqueeButton href={cert.file} target="_blank" rel="noopener noreferrer" variant="outline" icon={<IconExternalLink />}>
              Abrir en pestaña nueva
            </MarqueeButton>
          </div>
          {cert.redacted ? (
            <p className="mt-3 text-xs text-on-media/70">Por privacidad, el número de RUT está cubierto en esta copia.</p>
          ) : null}
        </>
      ) : null}
    </ModalDialog>
  )
}
