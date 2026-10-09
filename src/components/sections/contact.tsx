import { IconBrandLinkedin, IconBrandWhatsapp, IconCircleDot, IconDownload, IconMail } from "@tabler/icons-react"
import { CalafateBranch } from "@/components/decor/botanicals"
import { Mountains } from "@/components/decor/mountains"
import { AnimalDecor } from "@/components/layout/animal-decor"
import { Reveal } from "@/components/layout/reveal"
import { MarqueeButton } from "@/components/ui/marquee-button"
import { siteConfig } from "@/config/site.config"

const { contact, availability, cv } = siteConfig

const channels = [
  {
    label: "LinkedIn",
    sameTab: false,
    detail: "Alberto Astudillo",
    href: contact.linkedin,
    Icon: IconBrandLinkedin,
  },
  {
    label: "Correo",
    detail: contact.email,
    href: `mailto:${contact.email}`,
    Icon: IconMail,
    // mailto opens the mail app; a new tab would stay empty.
    sameTab: true,
  },
  {
    label: "WhatsApp",
    sameTab: false,
    detail: contact.phoneDisplay,
    href: contact.whatsapp,
    Icon: IconBrandWhatsapp,
  },
]

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative overflow-hidden pt-24 md:pt-32">
      <CalafateBranch className="pointer-events-none absolute top-20 right-[4%] hidden w-52 opacity-40 lg:block" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
          <div className="min-w-0">
            <Reveal as="header">
              <p className="eyebrow">Disponibilidad y contacto</p>
              <h2 id="contacto-title" className="mt-4 text-h2 font-medium tracking-tight">
                Conversemos sobre el próximo sendero
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              {/* Status uses an icon and text, never colour alone. */}
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm contrast:border-2">
                <IconCircleDot className="size-4 text-moss contrast:text-foreground" aria-hidden="true" />
                <span>
                  <span className="sr-only">Estado: </span>
                  {availability.status}
                </span>
              </p>
              <p className="mt-5 max-w-xl text-lead text-muted-foreground">{availability.note}</p>
            </Reveal>

            <Reveal delay={0.14}>
              <ul className="mt-10 grid gap-3 sm:grid-cols-3">
                {channels.map(({ label, detail, href, Icon, sameTab }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={sameTab ? undefined : "_blank"}
                      rel={sameTab ? undefined : "noopener noreferrer"}
                      data-no-underline
                      className="group flex h-full min-h-11 items-center gap-4 rounded-2xl border border-border bg-card/40 p-4 transition-colors hover:border-sand/60 hover:bg-card contrast:border-2 contrast:hover:bg-muted"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-muted text-sand transition-colors group-hover:bg-sand group-hover:text-forest contrast:text-foreground contrast:group-hover:bg-foreground contrast:group-hover:text-background">
                        <Icon className="size-5" stroke={1.6} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium group-hover:underline group-hover:underline-offset-4">{label}</span>
                        <span className="block text-sm [overflow-wrap:anywhere] text-muted-foreground">{detail}</span>
                      </span>
                      {sameTab ? null : <span className="sr-only">(se abre en una pestaña nueva)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
              <MarqueeButton href={contact.whatsapp} target="_blank" rel="noopener noreferrer" variant="moss" icon={<IconBrandWhatsapp />}>
                Escribir por WhatsApp
              </MarqueeButton>
              <MarqueeButton href={cv.href} download variant="ghost" icon={<IconDownload />}>
                {cv.label}
              </MarqueeButton>
            </Reveal>
          </div>

          <div className="relative min-w-0">
            <AnimalDecor slug="cometocino-patagonico" shape="leaf" className="mx-auto w-40 sm:w-48 lg:w-60" />
            <AnimalDecor
              slug="cometocino-de-gay"
              shape="stone"
              travel={20}
              className="mx-auto -mt-6 w-32 sm:w-36 lg:absolute lg:-bottom-6 lg:left-0 lg:mt-0 lg:w-40"
              flip
            />
          </div>
        </div>
      </div>
      <Mountains subtle className="mt-16" />
    </section>
  )
}
