import { useId } from "react"
import { useA11yTheme } from "@/hooks/use-a11y-theme"
import { cn } from "@/lib/utils"

/**
 * Day/night switch (from referencias/theme-switch.tsx) driving the
 * high-contrast / colour-blind theme: night = natural dark palette,
 * day = white high-contrast page. Rebuilt with CSS (`.theme-switch` in
 * index.css), a real checkbox with role="switch", a label for screen readers
 * and a visible focus ring. The knob position also tells the state, not only colour.
 */
export function ContrastSwitch({ className }: { className?: string }) {
  const { contrast, toggle } = useA11yTheme()
  const id = useId()
  return (
    <label htmlFor={id} className={cn("theme-switch", className)} title="Modo alto contraste / daltonismo">
      <input id={id} type="checkbox" role="switch" checked={contrast} onChange={toggle} aria-label="Modo alto contraste / daltonismo" />
      <span className="theme-switch-slider" aria-hidden="true">
        <span className="theme-switch-star theme-switch-star-1" />
        <span className="theme-switch-star theme-switch-star-2" />
        <span className="theme-switch-star theme-switch-star-3" />
        <svg viewBox="0 0 16 16" className="theme-switch-cloud">
          <path
            transform="matrix(.77976 0 0 .78395-299.99-418.63)"
            fill="#fff"
            d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
          />
        </svg>
      </span>
    </label>
  )
}
