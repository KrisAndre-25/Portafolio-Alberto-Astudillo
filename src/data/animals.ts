import { getImage, type ImageEntry } from "./images"

export type Animal = {
  slug: string
  /** Common name(s), shown as the caption. */
  name: string
  /** Scientific name when the species is identifiable. */
  scientific?: string
  /** Every animal visible in the image, for alt text and captions. */
  alt: string
  /** Illustration credit, when the source shows one. */
  credit?: string
  /** Transparent cutout (decorations) and paper plate (gallery). */
  image: ImageEntry
}

const animal = (slug: string, data: Omit<Animal, "slug" | "image">): Animal => ({
  slug,
  image: getImage(`animales/${slug}`),
  ...data,
})

export const animals: Animal[] = [
  animal("puma", {
    name: "Puma",
    scientific: "Puma concolor",
    alt: "Ilustración de un puma asomándose sobre una roca.",
  }),
  animal("condor", {
    name: "Cóndor andino",
    scientific: "Vultur gryphus",
    alt: "Silueta de un cóndor andino planeando con las alas abiertas.",
  }),
  animal("zorzal", {
    name: "Zorzal",
    scientific: "Turdus falcklandii",
    alt: "Ilustración de un zorzal de pico y patas amarillas.",
    credit: "Ilustración: Daniel Martínez-Piña",
  }),
  animal("cometocino-patagonico", {
    name: "Cometocino patagónico",
    scientific: "Phrygilus patagonicus",
    alt: "Ilustración de un cometocino patagónico, de cabeza gris azulada y pecho amarillo, posado en una rama.",
    credit: "Ilustración: Daniel Martínez-Piña",
  }),
  animal("cometocino-de-gay", {
    name: "Cometocino de Gay",
    scientific: "Phrygilus gayi",
    alt: "Ilustración de un cometocino de Gay, de cabeza gris y cuerpo amarillo oliva.",
    credit: "Ilustración: Daniel Martínez-Piña",
  }),
  animal("picaflor", {
    name: "Picaflor",
    alt: "Ilustración de un picaflor verde en vuelo.",
  }),
  animal("conejo", {
    name: "Conejo",
    alt: "Ilustración en acuarela de un conejo sentado.",
  }),
  animal("abejaruco", {
    name: "Abejaruco",
    scientific: "Merops apiaster",
    alt: "Ilustración de un abejaruco en vuelo, de plumaje turquesa, castaño y amarillo.",
  }),
  animal("aves-lamina", {
    name: "Lámina de aves",
    alt: "Lámina naturalista con una docena de aves reunidas: aves acuáticas, un cisne, aves de pastizal, pequeños pájaros y una rapaz.",
  }),
  animal("aves-fiordo-comau", {
    name: "Aves del Fiordo Comau & Hualaihué",
    alt:
      "Lámina «Aves del Fiordo Comau & Hualaihué» con 24 especies: torcaza, cometocino patagónico, churrete chico, " +
      "rayadito, carpintero negro, carpinterito, pitío, chucao, hued-hued del sur, picaflor chico, chercán, fío-fío, " +
      "queltehue, golondrina chilena, bandurria, zorzal, pato cortacorrientes, cisne de cuello negro, martín pescador, " +
      "garza grande, pilpilén, cormorán imperial, yeco y flamenco chileno.",
    credit: "Lámina «Aves del Fiordo Comau & Hualaihué»",
  }),
]
