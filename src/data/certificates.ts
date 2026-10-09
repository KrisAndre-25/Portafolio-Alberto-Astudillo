import generated from "./generated/certificates.json"
import type { ImageVariant } from "./images"
import { asset } from "@/lib/asset"

export type CertificateFile = {
  original: string
  type: "pdf" | "image"
  /** Public URL of the published copy. */
  file: string
  /** True when the RUT was covered in the published copy. */
  redacted: boolean
  width: number
  height: number
  thumb: Record<"md" | "sm", ImageVariant>
}

export type Certificate = CertificateFile & {
  slug: string
  title: string
  issuer: string
  /** As written on the CV or the certificate. */
  date: string
  hours?: string
}

const files = Object.fromEntries(
  Object.entries(generated as Record<string, CertificateFile>).map(([slug, f]) => [
    slug,
    {
      ...f,
      file: asset(f.file),
      thumb: { md: { ...f.thumb.md, src: asset(f.thumb.md.src) }, sm: { ...f.thumb.sm, src: asset(f.thumb.sm.src) } },
    },
  ]),
) as Record<string, CertificateFile>

const cert = (slug: string, data: Pick<Certificate, "title" | "issuer" | "date" | "hours">): Certificate => {
  const file = files[slug]
  if (!file) throw new Error(`Missing certificate "${slug}". Run the cert script.`)
  return { slug, ...file, ...data }
}

/** Ordered from most to least relevant for a park ranger profile. */
export const certificates: Certificate[] = [
  cert("titulo-tecnico-turismo-aventura", {
    title: "Técnico de Nivel Superior en Turismo Aventura",
    issuer: "CFT Santo Tomás",
    date: "Enero 2025",
  }),
  cert("primeros-auxilios-lugares-remotos", {
    title: "Primeros Socorros Avanzados en Lugares Remotos (W.A.F.A.)",
    issuer: "Aider · Centro Internacional de Entrenamiento ACES",
    date: "Septiembre 2024",
    hours: "55 horas",
  }),
  cert("credencial-primeros-auxilios-lugares-remotos", {
    title: "Credencial Primeros Socorros en Lugares Remotos",
    issuer: "Aider · ACES",
    date: "Septiembre 2024",
  }),
  cert("guia-de-turismo", {
    title: "Guía de Turismo",
    issuer: "CFT Santo Tomás",
    date: "Julio 2023",
    hours: "1044 horas pedagógicas",
  }),
  cert("biodiversidad-conservacion-humedales", {
    title: "Biodiversidad y Conservación de Humedales",
    issuer: "Universidad Santo Tomás · Facultad de Ciencias",
    date: "Julio 2024",
    hours: "50 horas",
  }),
  cert("glaciares-chilenos", {
    title: "Glaciares Chilenos: Cambio Climático, Adaptación y Biodiversidad",
    issuer: "U. Socioambiental · ONG FIMA y Friedrich Ebert Stiftung",
    date: "Julio 2024",
  }),
  cert("introduccion-derecho-ambiental", {
    title: "Introducción al Derecho Ambiental",
    issuer: "U. Socioambiental · ONG FIMA y Friedrich Ebert Stiftung",
    date: "Junio 2024",
  }),
  cert("sociologia-del-antropoceno", {
    title: "Sociología del Antropoceno",
    issuer: "U. Socioambiental · ONG FIMA y Friedrich Ebert Stiftung",
    date: "Junio 2024",
  }),
  cert("academia-liderazgo-juventudes-protagonistas", {
    title: "Academia de Liderazgo «Juventudes Protagonistas»",
    issuer: "Gobierno de Santiago · Fundación Observa Ciudadanía",
    date: "Agosto 2024",
    hours: "4 horas",
  }),
  cert("capacitacion-no-discriminacion", {
    title: "Inclusión y No Discriminación durante Tiempos de Juegos",
    issuer: "Ministerio Secretaría General de Gobierno · Santiago 2023",
    date: "Diciembre 2023",
  }),
  cert("capacitacion-voluntariado-santiago-2023", {
    title: "Capacitación General del Voluntariado Santiago 2023",
    issuer: "Gobierno de Santiago · Comité Olímpico de Chile · Santiago 2023",
    date: "2023",
  }),
  cert("participacion-santiago-2023", {
    title: "Voluntario Juegos Panamericanos Santiago 2023",
    issuer: "Panam Sports",
    date: "Octubre – Noviembre 2023",
  }),
  cert("inspector-educacional", {
    title: "Inspector Educacional – Asistente de la Educación",
    issuer: "Instituto de Capacitación Bienestar y Progreso",
    date: "Octubre 2020",
    hours: "40 horas",
  }),
]
