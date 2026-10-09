/**
 * Every editable text and link of the site lives here.
 * Values marked `PENDIENTE` are placeholders waiting for Alberto's input.
 */

const whatsappNumber = "56942413456"
const whatsappMessage = "Hola Alberto, vi tu portafolio y me gustaría conversar contigo."

export const siteConfig = {
  name: "Alberto Astudillo",
  fullName: "Alberto Andrés Astudillo Venegas",
  role: "Guardaparque · Torres del Paine",
  location: "Torres del Paine, Magallanes, Chile",

  meta: {
    title: "Alberto Astudillo · Guardaparque en Torres del Paine",
    description:
      "Portafolio de Alberto Astudillo, guardaparque en Las Torres Patagonia y Técnico en Turismo Aventura. Experiencia en parques, senderos, primeros auxilios en lugares remotos y corridas de montaña.",
  },

  hero: {
    eyebrow: "Las Torres Patagonia",
    // Provisional copy: to be refined with Alberto.
    tagline: "Cuido senderos, acompaño visitantes y recorro la montaña con respeto por el territorio.",
    primaryCta: { label: "Ver hitos", href: "#hitos" },
    secondaryCta: { label: "Contactar", href: "#contacto" },
  },

  /** PENDIENTE: confirm the availability text with Alberto. */
  availability: {
    status: "PENDIENTE: estado de disponibilidad",
    note: "Escríbeme para conversar sobre oportunidades en parques, turismo aventura o conservación.",
  },

  contact: {
    email: "alberto.astudillov@gmail.com",
    phoneDisplay: "+56 9 4241 3456",
    linkedin: "https://www.linkedin.com/in/alberto-astudillo-8755732ab/",
    whatsapp: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
  },

  /** Updated CV generated from the original (see public/assets/cv). */
  cv: {
    href: "/assets/cv/CV-Alberto-Astudillo-octubre-2026.pdf",
    label: "Descargar CV",
  },

  footer: {
    marquee: ["Guardaparque", "Torres del Paine", "Patagonia", "Trail running", "Conservación", "Montaña"],
    heading: "¿Conversemos?",
    giantText: "ASTUDILLO",
    copyright: "© 2026 Alberto Astudillo",
    /** PENDIENTE: developer signature shown in the footer. */
    credit: "Sitio desarrollado por PENDIENTE",
  },
} as const

export type SiteConfig = typeof siteConfig
