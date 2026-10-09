import { IconDownload, IconFirstAidKit, IconLanguage, IconMapPin, IconSchool, IconTrees } from "@tabler/icons-react"
import { NotroFlower } from "@/components/decor/botanicals"
import { Reveal } from "@/components/layout/reveal"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { MarqueeButton } from "@/components/ui/marquee-button"
import { siteConfig } from "@/config/site.config"
import { getImage, srcSet } from "@/data/images"

const photo = getImage("perfil/alberto-astudillo")

/** Quick facts, all taken from the CV. */
const facts = [
  { Icon: IconTrees, label: "Guardaparque en Las Torres Patagonia" },
  { Icon: IconMapPin, label: "Torres del Paine, Chile" },
  { Icon: IconSchool, label: "Técnico en Turismo Aventura" },
  { Icon: IconFirstAidKit, label: "Primeros auxilios en lugares remotos" },
  { Icon: IconLanguage, label: "Español · Inglés básico" },
]

export function About() {
  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-title" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-8 md:py-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        {/* 3D portrait over a soft green/earth light */}
        <div className="relative order-2 min-w-0 lg:order-1">
          <div
            aria-hidden="true"
            className="absolute inset-[8%] -z-10 rounded-[40%] bg-[radial-gradient(circle_at_30%_30%,color-mix(in_oklch,var(--moss)_45%,transparent),transparent_60%),radial-gradient(circle_at_75%_70%,color-mix(in_oklch,var(--clay)_40%,transparent),transparent_60%)] blur-3xl contrast:hidden"
          />
          <NotroFlower className="absolute -top-4 -left-2 w-24 opacity-70 sm:w-28" />
          <CardContainer containerClassName="py-0">
            <CardBody className="relative h-auto w-[min(88vw,24rem)] rounded-[2rem] border border-border bg-card/60 p-3 shadow-[var(--shadow-soft)] backdrop-blur-sm contrast:border-2">
              <CardItem translateZ={50} className="w-full">
                <img
                  src={photo.variants.md.src}
                  srcSet={srcSet(photo)}
                  sizes="(min-width: 1024px) 24rem, 88vw"
                  width={photo.width}
                  height={photo.height}
                  alt="Alberto Astudillo sonriendo en un sendero de montaña, con camisa de guardaparque de Parque Cordillera y una radio en la mano."
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
                />
              </CardItem>
              <CardItem
                translateZ={90}
                className="absolute bottom-7 left-7 rounded-full border border-border bg-background/85 px-4 py-2 text-xs font-medium tracking-[0.2em] uppercase backdrop-blur-md"
              >
                Guardaparque
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <Reveal as="header">
            <p className="eyebrow">Sobre mí</p>
            <h2 id="sobre-mi-title" className="mt-4 text-h2 font-medium tracking-tight">
              Entre senderos, visitantes y montaña
            </h2>
          </Reveal>
          <div className="mt-8 space-y-5 text-lead text-muted-foreground">
            <Reveal delay={0.05}>
              <p>
                Soy guardaparque en <strong className="font-medium text-foreground">Las Torres Patagonia</strong>, en Torres
                del Paine. Desde septiembre de 2026 patrullo el Cerro Paine, cierro el sendero Base Torres hasta el límite con
                CONAF y hago el monitoreo y reporte diario.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Soy Técnico de Nivel Superior en Turismo Aventura (CFT Santo Tomás) y Guía de Turismo. Antes fui guardaparque
                en la Asociación Parque Cordillera y en la Reserva Longotoma, e hice mi práctica como guardaparque en el
                Parque Andino Juncal.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p>
                Vengo de años de atención a público en recepción, ventas y barra, y he sido voluntario en Santiago 2023, la
                limpieza del río Mapocho y la reforestación del Gran Parque Costanera. Fuera del trabajo corro en calle y
                montaña; en 2023 guié la expedición al Cerro Leoneras, a 4.954 m.s.n.m.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Datos rápidos">
              {facts.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-sm"
                >
                  <Icon className="size-4 text-sand contrast:text-foreground" aria-hidden="true" stroke={1.6} />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.25} className="mt-9">
            <MarqueeButton href={siteConfig.cv.href} download variant="ghost" icon={<IconDownload className="size-4" aria-hidden="true" />}>
              {siteConfig.cv.label}
            </MarqueeButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
