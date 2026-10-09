import generated from "./generated/images.json"

export type ImageVariant = { src: string; width: number; height: number }

export type ImageEntry = {
  width: number
  height: number
  /** Original file name in public/, when the image comes from one. */
  original?: string
  variants: Record<string, ImageVariant>
}

const images = generated as Record<string, ImageEntry>

/** Looks up an optimized image by its key (e.g. "hitos/torres-del-paine-04"). */
export function getImage(key: string): ImageEntry {
  const entry = images[key]
  if (!entry) throw new Error(`Missing image "${key}". Run \`npm run assets\`.`)
  return entry
}

/** `srcSet` string from every variant of an entry, smallest first. */
export function srcSet(entry: ImageEntry, keys = Object.keys(entry.variants)): string {
  return keys
    .map((k) => entry.variants[k])
    .filter(Boolean)
    .sort((a, b) => a.width - b.width)
    .map((v) => `${v.src} ${v.width}w`)
    .join(", ")
}
