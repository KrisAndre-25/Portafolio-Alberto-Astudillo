import { CalafateBranch, FernSprig } from "@/components/decor/botanicals"
import { Reveal } from "@/components/layout/reveal"
import { SectionHeading } from "@/components/layout/section-heading"
import { hardSkills, softSkills, type Skill } from "@/data/skills"

function SkillGroup({ id, title, note, skills }: { id: string; title: string; note: string; skills: Skill[] }) {
  return (
    <div>
      <Reveal as="header" className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
        <h3 id={id} className="text-h3 font-medium">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{note}</p>
      </Reveal>
      <ul aria-labelledby={id} className="mt-6 grid gap-3 sm:grid-cols-2">
        {skills.map(({ name, context, Icon }, i) => (
          <Reveal as="li" key={name} delay={Math.min(i, 6) * 0.04}>
            <article className="group flex h-full gap-4 rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-sand/50 hover:bg-card contrast:border-2 contrast:hover:bg-muted">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-sand transition-colors group-hover:bg-sand group-hover:text-forest contrast:text-foreground contrast:group-hover:bg-foreground contrast:group-hover:text-background">
                <Icon className="size-5" stroke={1.5} aria-hidden="true" />
              </span>
              <div>
                <h4 className="font-medium leading-snug">{name}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{context}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}

export function Skills() {
  return (
    <section id="habilidades" aria-labelledby="habilidades-title" className="relative overflow-hidden border-y border-border bg-card/30">
      <FernSprig className="pointer-events-none absolute top-16 -right-6 hidden w-28 opacity-50 lg:block" />
      <CalafateBranch className="pointer-events-none absolute bottom-10 -left-8 hidden w-56 opacity-40 lg:block" />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-8 md:py-32">
        <SectionHeading
          id="habilidades-title"
          eyebrow="Habilidades"
          title="Lo que llevo a cada jornada"
          intro="Oficio de terreno y formación técnica, junto a lo que dejaron años de trabajo con personas."
        />
        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-12">
          <SkillGroup id="duras-title" title="Duras" note="Técnicas y certificadas" skills={hardSkills} />
          <SkillGroup id="blandas-title" title="Blandas" note="Transferibles" skills={softSkills} />
        </div>
      </div>
    </section>
  )
}
