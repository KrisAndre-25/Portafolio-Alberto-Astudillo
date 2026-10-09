import { IconMapPin } from "@tabler/icons-react"
import { SectionHeading } from "@/components/layout/section-heading"
import { Timeline, type TimelineEntry } from "@/components/ui/timeline"
import { experience } from "@/data/experience"
import { srcSet } from "@/data/images"

const data: TimelineEntry[] = experience.map((job) => ({
  title: job.title,
  subtitle: job.subtitle,
  content: (
    <article className="rounded-3xl border border-border bg-card/40 p-5 sm:p-7 contrast:border-2">
      <h4 className="font-heading text-h3 font-medium">{job.role}</h4>
      <p className="mt-2 flex items-start gap-2 text-muted-foreground">
        <IconMapPin className="mt-1 size-4 shrink-0 text-sand contrast:text-foreground" aria-hidden="true" />
        <span>
          {job.place}
          <span className="block text-sm text-sand contrast:text-foreground">{job.period}</span>
        </span>
      </p>
      {job.tasks.length ? (
        <ul className="mt-5 space-y-2">
          {job.tasks.map((task) => (
            <li key={task} className="flex gap-3 text-[0.95rem] leading-relaxed">
              <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-sand contrast:bg-foreground" />
              {task}
            </li>
          ))}
        </ul>
      ) : null}
      {job.photos.length ? (
        <div className={`mt-6 grid gap-3 ${job.photos.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {job.photos.map(({ image, alt }) => (
            <img
              key={image.variants.sm.src}
              src={image.variants.card?.src ?? image.variants.md.src}
              srcSet={srcSet(image, ["sm", "card", "md"].filter((k) => image.variants[k]))}
              sizes="(min-width: 1024px) 22rem, 45vw"
              width={image.width}
              height={image.height}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="h-32 w-full rounded-xl border border-border object-cover object-[50%_25%] sm:h-44 lg:h-56"
            />
          ))}
        </div>
      ) : null}
    </article>
  ),
}))

export function Experience() {
  return (
    <section id="experiencia" aria-labelledby="experiencia-title" className="relative overflow-clip">
      <Timeline
        data={data}
        header={
          <SectionHeading
            id="experiencia-title"
            eyebrow="Experiencia"
            title="Trayectoria en parques y montaña"
            intro="Solo el trabajo en parques, guardaparques y guiados de montaña, del más reciente al primero."
          />
        }
      />
    </section>
  )
}
