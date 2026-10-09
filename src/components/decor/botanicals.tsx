import { cn } from "@/lib/utils"

/**
 * Fine-line botanical drawings (own SVG, no clipart): a fern sprig, a
 * notro-like flower and a calafate branch. Purely decorative.
 * They inherit `currentColor`, so they follow the theme.
 */

type Props = { className?: string }

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
}

export function FernSprig({ className }: Props) {
  return (
    <svg viewBox="0 0 120 220" aria-hidden="true" className={cn("text-moss", className)}>
      <path {...stroke} d="M60 215C58 160 62 100 70 10" />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 190 - i * 20
        const x = 60 + (190 - y) * 0.05
        const len = 38 - i * 3
        return (
          <g key={i}>
            <path {...stroke} d={`M${x} ${y}C${x - len * 0.5} ${y - 6} ${x - len * 0.9} ${y - 2} ${x - len} ${y + 8}`} />
            <path {...stroke} d={`M${x} ${y - 4}C${x + len * 0.5} ${y - 12} ${x + len * 0.9} ${y - 8} ${x + len} ${y + 2}`} />
          </g>
        )
      })}
    </svg>
  )
}

export function NotroFlower({ className }: Props) {
  return (
    <svg viewBox="0 0 160 200" aria-hidden="true" className={cn("text-clay", className)}>
      <path {...stroke} d="M80 196C78 150 82 120 80 92" className="text-moss" stroke="currentColor" />
      <path {...stroke} d="M80 150C64 138 52 140 42 132M80 132C96 120 110 122 120 112" />
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg) => (
        <path
          key={deg}
          {...stroke}
          transform={`rotate(${deg} 80 70)`}
          d="M80 70C82 52 86 40 92 30C94 26 98 26 97 31C95 42 88 54 80 70"
        />
      ))}
      <circle cx="80" cy="70" r="4" {...stroke} />
    </svg>
  )
}

export function CalafateBranch({ className }: Props) {
  return (
    <svg viewBox="0 0 220 120" aria-hidden="true" className={cn("text-glacier", className)}>
      <path {...stroke} d="M6 100C60 86 120 70 214 24" />
      {[30, 64, 98, 132, 166].map((x, i) => {
        const y = 100 - (x - 6) * 0.36
        return (
          <g key={x}>
            <path {...stroke} d={`M${x} ${y}C${x - 6} ${y - 16} ${x + 4} ${y - 26} ${x + 12} ${y - 30}C${x + 14} ${y - 18} ${x + 8} ${y - 8} ${x} ${y}`} />
            {i % 2 === 0 ? <circle cx={x + 8} cy={y + 12} r="4.5" {...stroke} /> : null}
          </g>
        )
      })}
    </svg>
  )
}
