import { IconX } from "@tabler/icons-react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type ModalDialogProps = {
  open: boolean
  onClose: () => void
  /** Accessible name (visually hidden unless `showTitle`). */
  title: string
  showTitle?: boolean
  children: React.ReactNode
  className?: string
  /** Rendered next to the panel on wide screens (e.g. an animal illustration). */
  aside?: React.ReactNode
}

/**
 * Accessible modal on top of the native <dialog>: showModal() makes the rest
 * of the page inert (focus is trapped), Esc closes, the backdrop click closes,
 * and focus returns to the element that opened it.
 */
export function ModalDialog({ open, onClose, title, showTitle = false, children, className, aside }: ModalDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null
      dialog.showModal()
      document.documentElement.style.overflow = "hidden"
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={showTitle ? undefined : title}
      aria-labelledby={showTitle ? "modal-title" : undefined}
      onClose={() => {
        document.documentElement.style.overflow = ""
        onClose()
        opener.current?.focus()
      }}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        // A click on the <dialog> itself (not its content) is the backdrop.
        if (e.target === e.currentTarget) onClose()
      }}
      className={cn(
        "m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-foreground backdrop:bg-overlay/90 backdrop:backdrop-blur-sm",
        "open:flex open:items-center open:justify-center",
      )}
    >
      {aside}
      <div className={cn("relative flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] flex-col", className)}>
        <div className="flex items-center justify-between gap-4 pb-3">
          {showTitle ? (
            <h2 id="modal-title" className="font-heading text-h3 text-on-media">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-on-media/30 bg-overlay/60 text-on-media transition-colors hover:bg-on-media hover:text-overlay contrast:border-2"
            autoFocus
          >
            <IconX className="size-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
