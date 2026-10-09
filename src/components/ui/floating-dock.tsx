/**
 * Aceternity FloatingDock, adapted for this site:
 * - theme tokens instead of greys, so it follows the contrast theme;
 * - items can be links (`href`) or buttons (`onClick`, optional `pressed`);
 * - `active` marks the current section (aria-current + underline, not colour only);
 * - labels show on hover *and* keyboard focus; magnification is off for reduced motion;
 * - a `leading` slot (the logo) on the left;
 * - mobile: a collapsible menu with visible labels, 44px targets, Esc to close.
 * Desktop sits at the bottom centre, mobile at the bottom right.
 */

import { cn } from "@/lib/utils"
import { IconLayoutNavbarCollapse, IconX } from "@tabler/icons-react"
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import { useEffect, useId, useRef, useState } from "react"

export type DockItem = {
  title: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  /** Current section. */
  active?: boolean
  /** Toggle state for button items (aria-pressed). */
  pressed?: boolean
}

export const FloatingDock = ({
  items,
  leading,
  desktopClassName,
  mobileClassName,
  label = "Navegación principal",
}: {
  items: DockItem[]
  leading?: React.ReactNode
  desktopClassName?: string
  mobileClassName?: string
  label?: string
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} leading={leading} className={desktopClassName} label={label} />
      <FloatingDockMobile items={items} leading={leading} className={mobileClassName} label={label} />
    </>
  )
}

const surface =
  "border border-border bg-card/80 text-foreground shadow-[var(--shadow-soft)] backdrop-blur-xl " +
  "contrast:bg-background contrast:border-2"

const FloatingDockMobile = ({
  items,
  leading,
  className,
  label,
}: {
  items: DockItem[]
  leading?: React.ReactNode
  className?: string
  label: string
}) => {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <nav aria-label={label} className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={menuId}
            layoutId="nav"
            className={cn("absolute right-0 bottom-full mb-3 flex w-60 flex-col gap-1 rounded-2xl p-2", surface)}
          >
            {items.map((item, idx) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.03 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.03 }}
              >
                <DockAction
                  item={item}
                  onDone={() => setOpen(false)}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors hover:bg-muted",
                    item.active && "bg-muted font-semibold underline decoration-2 underline-offset-4",
                  )}
                >
                  <span className="size-5 shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.title}
                </DockAction>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <div className={cn("flex items-center gap-2 rounded-full p-1.5", surface)}>
        {leading}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex size-11 items-center justify-center rounded-full bg-muted transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {open ? <IconX className="size-5" /> : <IconLayoutNavbarCollapse className="size-5" />}
        </button>
      </div>
    </nav>
  )
}

const FloatingDockDesktop = ({
  items,
  leading,
  className,
  label,
}: {
  items: DockItem[]
  leading?: React.ReactNode
  className?: string
  label: string
}) => {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.nav
      aria-label={label}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn("mx-auto hidden h-16 items-end gap-3 rounded-2xl px-3 pb-3 md:flex", surface, className)}
    >
      {leading ? <div className="mr-1 flex h-10 items-center border-r border-border pr-3">{leading}</div> : null}
      <ul className="flex items-end gap-3">
        {items.map((item) => (
          <li key={item.title}>
            <IconContainer mouseX={mouseX} item={item} />
          </li>
        ))}
      </ul>
    </motion.nav>
  )
}

/** Renders an item as <a> or <button>, with the right ARIA state. */
function DockAction({
  item,
  className,
  children,
  onDone,
  ...rest
}: {
  item: DockItem
  className?: string
  children: React.ReactNode
  onDone?: () => void
} & React.HTMLAttributes<HTMLElement>) {
  if (item.href) {
    return (
      <a
        href={item.href}
        aria-current={item.active ? "location" : undefined}
        className={className}
        onClick={onDone}
        data-no-underline
        {...(rest as React.HTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }
  return (
    <button
      type="button"
      aria-pressed={item.pressed}
      className={className}
      onClick={() => {
        item.onClick?.()
        onDone?.()
      }}
      {...(rest as React.HTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}

function IconContainer({ mouseX, item }: { mouseX: MotionValue<number>; item: DockItem }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const big = reduced ? 44 : 72
  const widthTransform = useTransform(distance, [-150, 0, 150], [44, big, 44])
  const heightTransform = useTransform(distance, [-150, 0, 150], [44, big, 44])
  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, reduced ? 20 : 34, 20])
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, reduced ? 20 : 34, 20])

  const spring = { mass: 0.1, stiffness: 150, damping: 12 }
  const width = useSpring(widthTransform, spring)
  const height = useSpring(heightTransform, spring)
  const widthIcon = useSpring(widthTransformIcon, spring)
  const heightIcon = useSpring(heightTransformIcon, spring)

  const [hovered, setHovered] = useState(false)
  const show = () => setHovered(true)
  const hide = () => setHovered(false)

  return (
    <DockAction
      item={item}
      className="group block rounded-full"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-label={item.title}
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors",
          "group-hover:text-foreground",
          item.active && "bg-primary text-primary-foreground group-hover:text-primary-foreground",
          item.pressed && "bg-foreground text-background group-hover:text-background",
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.span
              role="tooltip"
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="pointer-events-none absolute -top-9 left-1/2 w-fit rounded-md border border-border bg-popover px-2 py-0.5 text-xs whitespace-pre text-popover-foreground"
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>
        <motion.span style={{ width: widthIcon, height: heightIcon }} className="flex items-center justify-center" aria-hidden="true">
          {item.icon}
        </motion.span>
        {/* Non-colour cue for the current section. */}
        {item.active ? <span aria-hidden="true" className="absolute -bottom-2 h-1 w-1 rounded-full bg-foreground" /> : null}
      </motion.div>
    </DockAction>
  )
}
