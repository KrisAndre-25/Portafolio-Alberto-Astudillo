import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Call-to-action button from referencias/button-frame.tsx: a solid block whose
 * border shows only at the corners; on hover/focus the frame closes (top and
 * bottom first, then the sides). Rebuilt with CSS and theme tokens
 * (`.btn-frame` in index.css), without styled-components and without the
 * original's invalid <a> inside <button>: renders an <a> when `href` is set,
 * a <button> otherwise.
 */

type Variant = "light" | "dark" | "moss"

type CommonProps = {
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: Variant
  className?: string
}

type AnchorProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & { href: string }
type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & { href?: undefined }

export type FrameButtonProps = AnchorProps | ButtonProps

export function FrameButton(props: FrameButtonProps) {
  const { children, icon, variant = "dark", className, ...rest } = props
  const content = (
    <span className="btn-frame-label">
      {icon ? (
        <span className="btn-frame-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  )
  const shared = { className: cn("btn-frame", className), "data-variant": variant }

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
