import { getImage, type ImageEntry } from "./images"

export type MilestoneCategory = "carrera" | "cumbre" | "trekking" | "parque"

export type MilestonePhoto = { image: ImageEntry; alt: string }

export type Milestone = {
  slug: string
  /** Visible title. The original file name is kept in each image entry. */
  title: string
  category: MilestoneCategory
  /** Optional: fill in when known (e.g. "Junio 2024"). Hidden when empty. */
  date?: string
  /** Optional short description. Hidden when empty. */
  description?: string
  /** Index (in `photos`) of the cover shown in the carousel. */
  cover: number
  photos: MilestonePhoto[]
}

export const CATEGORY_LABEL: Record<MilestoneCategory, string> = {
  carrera: "Carrera",
  cumbre: "Cumbre",
  trekking: "Trekking",
  parque: "Parque",
}

/** Builds photos for `slug-01`…`slug-NN` with one alt text per photo. */
const photos = (slug: string, alts: string[]): MilestonePhoto[] =>
  alts.map((alt, i) => ({ image: getImage(`hitos/${slug}-${String(i + 1).padStart(2, "0")}`), alt }))

export const milestones: Milestone[] = [
  {
    slug: "torres-del-paine",
    title: "Torres del Paine",
    category: "parque",
    cover: 3,
    photos: photos("torres-del-paine", [
      "Alberto con sombrero, mochila naranja y radio en un bosque de lengas sin hojas.",
      "Ladera con matorrales y árboles secos bajo un cielo nublado en la Patagonia.",
      "Picos del macizo del Paine recortados contra nubes rosadas al atardecer.",
      "Las Torres del Paine bajo cielo azul, sobre el Refugio Central y su letrero.",
      "Selfie de Alberto con polera de Las Torres, mochila naranja y bastones en una ladera.",
      "Alberto con gorro y cuello abrigado al amanecer, con un lago al fondo del valle.",
      "Alberto con chaqueta de Las Torres Patagonia y gorro en un valle con un lago al fondo.",
      "Alberto cubierto de nieve con capucha y cuello, en un sendero nevado entre árboles.",
      "Alberto se fotografía en un espejo de una cabaña de madera, con mochila y radio.",
    ]),
  },
  {
    slug: "cumbre-cerro-leoneras",
    title: "Cumbre Cerro Leoneras, 4.954 m.s.n.m.",
    category: "cumbre",
    cover: 0,
    photos: photos("cumbre-cerro-leoneras", [
      "Alberto en la cumbre rocosa del Cerro Leoneras, a contraluz del sol, con cordones nevados al fondo.",
    ]),
  },
  {
    slug: "trekking-riscos-del-sauce",
    title: "Trekking Riscos del Sauce – Alhué, RM, Chile",
    category: "trekking",
    cover: 0,
    photos: photos("trekking-riscos-del-sauce", [
      "Alberto de espaldas con bastones en el Mirador el Boldo, mirando el valle de Alhué bajo la niebla.",
    ]),
  },
  {
    slug: "gp-parque-cordillera",
    title: "GP Parque Cordillera",
    category: "parque",
    cover: 0,
    photos: photos("gp-parque-cordillera", [
      "Equipo de guardaparques de Parque Cordillera posando con poleras azules entre árboles.",
    ]),
  },
  {
    slug: "asics-golden-run-21k",
    title: "Asics Golden Run 21K",
    category: "carrera",
    cover: 0,
    photos: photos("asics-golden-run-21k", [
      "Alberto corre con polera azul junto a otro corredor, con la cordillera nevada al fondo.",
      "Alberto con polera azul y chaleco de hidratación corre por una avenida mojada.",
      "Alberto saluda a la cámara mientras corre con su número de competidor.",
      "Alberto corre por el asfalto mojado, con otros corredores detrás.",
      "Alberto apunta a la cámara corriendo junto a una baranda verde y árboles.",
    ]),
  },
  {
    slug: "marley-coffee-stgo-10k",
    title: "Marley Coffee Stgo 10K",
    category: "carrera",
    cover: 0,
    photos: photos("marley-coffee-stgo-10k", [
      "Alberto muestra su medalla frente al panel de auspiciadores de la Stgo 10K.",
      "Alberto corre con ropa negra y lentes de sol bajo el sol de la mañana.",
      "Alberto cruza el arco de meta de la Stgo 10K con el reloj marcando 00:56:25.",
      "Alberto saluda con la mano mientras corre por una calle con árboles.",
      "Alberto llega a la meta bajo el arco de la Stgo 10K.",
    ]),
  },
  {
    slug: "corrida-pride-run-7k",
    title: "Corrida Pride Run 7K",
    category: "carrera",
    cover: 1,
    photos: photos("corrida-pride-run-7k", [
      "Alberto junto a otros corredores con poleras celestes de la Pride Run.",
      "Alberto corre junto al río con polera celeste y hace el gesto de la paz.",
      "Selfie de Alberto con su medalla de la Pride Run y chaleco de hidratación.",
    ]),
  },
  {
    slug: "corrida-mapocho-rio-arriba-10k",
    title: "Corrida Mapocho Río Arriba 10K",
    category: "carrera",
    cover: 0,
    photos: photos("corrida-mapocho-rio-arriba-10k", [
      "Alberto con los brazos en alto en el arco «Santiago fluye contigo» junto a la mascota de la carrera.",
    ]),
  },
  {
    slug: "corrida-canina-2k",
    title: "Corrida Canina 2K",
    category: "carrera",
    cover: 2,
    photos: photos("corrida-canina-2k", [
      "Alberto con polera verde corre con un perro con correa por un sendero de parque.",
      "Alberto y otros corredores con sus perros cruzan el arco de la Pet Run.",
      "Alberto corre con un perro por un sendero de hojas secas en otoño.",
    ]),
  },
]
