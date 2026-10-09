import {
  IconAffiliate,
  IconBuildingStore,
  IconCash,
  IconClipboardCheck,
  IconCompass,
  IconFirstAidKit,
  IconFlame,
  IconHeartHandshake,
  IconLanguage,
  IconLeaf,
  IconMapRoute,
  IconMessageCircle,
  IconMountain,
  IconReport,
  IconSchool,
  IconTable,
  IconUsersGroup,
  type Icon,
} from "@tabler/icons-react"

export type Skill = {
  name: string
  /** One line of context, tied to a concrete experience. */
  context: string
  Icon: Icon
  /**
   * "cv": stated in the CV (or in the new experience Alberto provided).
   * "inferida": transferable skill deduced from that experience — to be approved by Alberto.
   */
  source: "cv" | "inferida"
  /** Where it comes from, for review. Not shown on the site. */
  basis: string
}

export const hardSkills: Skill[] = [
  {
    name: "Patrullaje y cierre de senderos",
    context: "Patrullaje del Cerro Paine y cierre del sendero Base Torres hasta el límite con CONAF.",
    Icon: IconMapRoute,
    source: "cv",
    basis: "Guardaparque Las Torres Patagonia; Parque Cordillera (patrullaje de senderos); Reserva Longotoma (patrullajes).",
  },
  {
    name: "Monitoreo y reporte diario",
    context: "Registro diario en terreno y control de gestión en Las Torres Patagonia.",
    Icon: IconReport,
    source: "cv",
    basis: "Guardaparque Las Torres Patagonia: monitoreo y reporte diario, control de gestión.",
  },
  {
    name: "Primeros auxilios en lugares remotos",
    context: "Curso W.A.F.A. de 55 horas, con credencial de Aider / ACES.",
    Icon: IconFirstAidKit,
    source: "cv",
    basis: "Curso Primeros Socorros Avanzados en Lugares Remotos (W.A.F.A.), septiembre 2024.",
  },
  {
    name: "Mantención de senderos y áreas de camping",
    context: "Mantención de senderos, sitios de camping, baños y sector de basureros.",
    Icon: IconLeaf,
    source: "cv",
    basis: "Parque Cordillera y Camping Reserva Longotoma.",
  },
  {
    name: "Guiado e interpretación",
    context: "Guía de Turismo (1044 h) con guiados en Cerro Chena y la expedición al Cerro Leoneras.",
    Icon: IconCompass,
    source: "cv",
    basis: "Certificado Guía de Turismo; extracurricular Cerro Chena y Cerro Leoneras.",
  },
  {
    name: "Alta montaña",
    context: "Expedición y guiado al Cerro Leoneras, 4.954 m.s.n.m.",
    Icon: IconMountain,
    source: "cv",
    basis: "Guiado Cerro Leoneras, diciembre 2023.",
  },
  {
    name: "Conservación y medio ambiente",
    context: "Cursos de humedales, glaciares chilenos, derecho ambiental y sociología del antropoceno.",
    Icon: IconAffiliate,
    source: "cv",
    basis: "Cursos U. Santo Tomás y U. Socioambiental (ONG FIMA), 2024.",
  },
  {
    name: "Recepción y registro de visitantes",
    context: "Check-in y check-out, registro de deportistas y visitantes en parques.",
    Icon: IconClipboardCheck,
    source: "cv",
    basis: "Parque Cordillera, Parque La Reina, Reserva Longotoma.",
  },
  {
    name: "Caja, Transbank e inventarios",
    context: "Apertura y cierre de caja, cuadratura, arqueo e inventarios.",
    Icon: IconCash,
    source: "cv",
    basis: "Fashion's Park, Head Chile, Delicias Restaurant, Reserva Longotoma.",
  },
  {
    name: "Office y Excel",
    context: "Microsoft Office nivel usuario y Excel nivel básico.",
    Icon: IconTable,
    source: "cv",
    basis: "Habilidades y competencias del CV.",
  },
  {
    name: "Inglés básico",
    context: "Hablado y escrito, nivel básico.",
    Icon: IconLanguage,
    source: "cv",
    basis: "Habilidades y competencias del CV.",
  },
]

export const softSkills: Skill[] = [
  {
    name: "Atención a públicos diversos",
    context: "Amplia aptitud para manejar distintos contextos y clientes, siempre con la mejor atención.",
    Icon: IconHeartHandshake,
    source: "cv",
    basis: "Habilidades y competencias del CV.",
  },
  {
    name: "Comunicación con visitantes",
    context: "Orientar, informar y acompañar a visitantes en recepción, guiados y senderos.",
    Icon: IconMessageCircle,
    source: "inferida",
    basis: "Recepción en parques, guiados interpretativos, atención al cliente en ventas y call-center.",
  },
  {
    name: "Toma de decisiones en terreno",
    context: "Resolver con criterio propio durante patrullajes y cierres de sendero.",
    Icon: IconCompass,
    source: "inferida",
    basis: "Patrullajes y cierre de sendero en Las Torres Patagonia, Parque Cordillera y Longotoma.",
  },
  {
    name: "Lectura del territorio",
    context: "Orientarse y leer el entorno de montaña, del cerro isla a la alta cordillera.",
    Icon: IconMountain,
    source: "inferida",
    basis: "Patrullaje Cerro Paine, guiados Cerro Chena y Cerro Leoneras.",
  },
  {
    name: "Trabajo bajo presión",
    context: "Operación en eventos masivos y temporadas de alta afluencia.",
    Icon: IconFlame,
    source: "inferida",
    basis: "Voluntario Santiago 2023, banderillero Maratón de Santiago 2026, atención en temporada de camping.",
  },
  {
    name: "Trabajo en equipo",
    context: "Coordinación con equipos de guardaparques, voluntariados y tiendas.",
    Icon: IconUsersGroup,
    source: "inferida",
    basis: "Equipos de guardaparques, voluntariados (Santiago 2023, Ríos Limpios, reforestación).",
  },
  {
    name: "Liderazgo",
    context: "Jefe interino de tienda y Academia de Liderazgo «Juventudes Protagonistas».",
    Icon: IconBuildingStore,
    source: "inferida",
    basis: "Jefe interino Head Chile (Portal La Reina); Academia de Liderazgo, agosto 2024.",
  },
  {
    name: "Educación ambiental",
    context: "Apoyo en talleres de educación ambiental y voluntariados de limpieza y reforestación.",
    Icon: IconSchool,
    source: "inferida",
    basis: "Ayudante en Taller de Ed. Ambiental (Longotoma); Ríos Limpios; Reforestación Gran Parque Costanera.",
  },
]
