import { Reveal } from "@/components/layout/reveal"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  id: string
  eyebrow: string
  title: string
  intro?: string
  className?: string
  align?: "left" | "center"
}

/** Eyebrow + serif h2 + optional intro, shared by every section. `id` feeds aria-labelledby. */
export function SectionHeading({ id, eyebrow, title, intro, className, align = "left" }: SectionHeadingProps) {
  return (
    <Reveal as="header" className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-4 text-h2 font-medium tracking-tight">
        {title}
      </h2>
      {intro ? <p className="mt-5 text-lead text-muted-foreground">{intro}</p> : null}
    </Reveal>
  )
}
