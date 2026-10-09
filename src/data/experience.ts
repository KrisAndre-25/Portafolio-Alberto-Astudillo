import { getImage, type ImageEntry } from "./images"

/**
 * Work in parks and adventure tourism only (from the CV and the new
 * Las Torres Patagonia experience). Retail, bar and call-center jobs stay in
 * the CV but are left out of this timeline on purpose.
 */
export type ExperienceItem = {
  /** Timeline label (year or range). */
  title: string
  /** Short tag under the label. */
  subtitle: string
  role: string
  place: string
  period: string
  tasks: string[]
  /** `position`: CSS object-position for the crop (default "50% 25%"). */
  photos: { image: ImageEntry; alt: string; position?: string }[]
}

const photo = (key: string, alt: string, position?: string) => ({ image: getImage(key), alt, position })

export const experience: ExperienceItem[] = [
  {
    title: "2026",
    subtitle: "Actual",
    role: "Guardaparque",
    place: "Las Torres Patagonia, Torres del Paine",
    period: "Septiembre 2026 a la fecha",
    tasks: [
      "Patrullaje Cerro Paine y permanencia.",
      "Cierre Sendero Base Torres hasta límite con CONAF.",
      "Monitoreo y reporte diario.",
      "Control de gestión.",
    ],
    photos: [
      photo("hitos/torres-del-paine-04", "Las Torres del Paine sobre el Refugio Central."),
      photo("hitos/torres-del-paine-07", "Alberto con chaqueta de Las Torres Patagonia en un valle con un lago al fondo."),
      photo("hitos/torres-del-paine-08", "Alberto cubierto de nieve en un sendero nevado."),
      photo("hitos/torres-del-paine-03", "Picos del macizo del Paine al atardecer."),
    ],
  },
  {
    title: "2025 – 2026",
    subtitle: "Parque Cordillera",
    role: "Guardaparque",
    place: "Asociación Parque Cordillera",
    period: "Noviembre 2025 – Abril 2026",
    tasks: [
      "Mantención de senderos.",
      "Orden y limpieza de recepción.",
      "Patrullaje de senderos de distintos parques.",
      "Recepción de clientes (check-in y check-out).",
      "Limpieza de baños y sector de basureros.",
    ],
    photos: [
      photo("hitos/gp-parque-cordillera-01", "Equipo de guardaparques de Parque Cordillera."),
      photo("perfil/alberto-astudillo", "Alberto con camisa de guardaparque de Parque Cordillera y radio en un sendero."),
    ],
  },
  {
    title: "2025",
    subtitle: "Reserva Longotoma",
    role: "Guardaparque",
    place: "Camping Reserva Longotoma",
    period: "Mayo 2025 – Noviembre 2025",
    tasks: [
      "Mantención de sitios de camping, recepción y baños.",
      "Patrullajes en camping y playa.",
      "Atención al cliente (hospitalidad).",
      "Ayudante en Taller de Educación Ambiental y Primer Encuentro con Caballos.",
    ],
    photos: [],
  },
  {
    title: "2025",
    subtitle: "Parque La Reina",
    role: "Recepcionista",
    place: "Parque La Reina",
    period: "Enero 2025 – Mayo 2025",
    tasks: ["Recepción y registro de deportistas y visitantes."],
    photos: [],
  },
  {
    title: "2024",
    subtitle: "Práctica",
    role: "Guardaparques (práctica laboral)",
    place: "Parque Andino Juncal, Los Andes, V Región",
    period: "Febrero – Marzo 2024",
    tasks: [],
    photos: [],
  },
  {
    title: "2023",
    subtitle: "Guiados",
    role: "Guía",
    place: "Cerro Leoneras (4.954 m.s.n.m.) · Cerro Chena",
    period: "Julio y diciembre 2023",
    tasks: [
      "Guiado de la expedición al Cerro Leoneras, diciembre 2023.",
      "Guiado interpretativo en el Cerro Chena con Fundación Planificable, Día de los Cerros, julio 2023.",
    ],
    photos: [photo("hitos/cumbre-cerro-leoneras-01", "Alberto en la cumbre rocosa del Cerro Leoneras, con cordones nevados al fondo.", "50% 72%")],
  },
]
