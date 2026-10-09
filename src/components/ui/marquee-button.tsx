import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Call-to-action button with the "button-23" marquee: on hover/focus the label
 * scrolls sideways. Built with CSS + theme tokens (see `.btn-marquee` in
 * index.css). Renders an <a> when `href` is set, a <button> otherwise. The
 * marquee is off for reduced motion and on touch screens.
 */

type Variant = "solid" | "outline" | "moss" | "ghost"

type CommonProps = {
  /** Visible label. Must be plain text: the marquee repeats it. */
  children: string
  icon?: React.ReactNode
  variant?: Variant
  className?: string
}

type AnchorProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & { href: string }
type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & { href?: undefined }

export type MarqueeButtonProps = AnchorProps | ButtonProps

export function MarqueeButton(props: MarqueeButtonProps) {
  const { children, icon, variant = "solid", className, ...rest } = props
  // Gap between repeated labels grows with the label so copies never overlap.
  const spacing = `${(children.length * 0.78 + 2).toFixed(2)}em`
  const style = { "--spacing": spacing, "--duration": `${Math.max(1, children.length / 9).toFixed(2)}s` } as React.CSSProperties

  const content = (
    <>
      <span className="btn-marquee-label">
        {icon ? (
          <span className="btn-marquee-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {children}
      </span>
      <span className="btn-marquee-track" aria-hidden="true">
        {children}
      </span>
    </>
  )

  const shared = { className: cn("btn-marquee", className), "data-variant": variant, style }

  if (rest.href !== undefined) {
    return (
      <a data-no-underline {...(rest as Omit<AnchorProps, keyof CommonProps>)} {...shared}>
        {content}
      </a>
    )
  }
  const { type = "button", ...buttonRest } = rest as Omit<ButtonProps, keyof CommonProps>
  return (
    <button type={type} {...buttonRest} {...shared}>
      {content}
    </button>
  )
}
