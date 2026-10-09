import {
  IconAward,
  IconHome,
  IconMail,
  IconMountain,
  IconPaw,
  IconTools,
  IconUser,
} from "@tabler/icons-react"

/** One-page anchors, in order. Used by the dock and the active-section observer. */
export const SECTIONS = [
  { id: "inicio", title: "Inicio", Icon: IconHome },
  { id: "sobre-mi", title: "Sobre mí", Icon: IconUser },
  { id: "habilidades", title: "Habilidades", Icon: IconTools },
  { id: "hitos", title: "Hitos", Icon: IconMountain },
  { id: "fauna", title: "Fauna", Icon: IconPaw },
  { id: "certificaciones", title: "Certificaciones", Icon: IconAward },
  { id: "contacto", title: "Contacto", Icon: IconMail },
] as const
