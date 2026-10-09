// Generates optimized, safely-named copies of every source asset in public/
// into public/assets/ and writes their dimensions to src/data/generated/images.json.
// Originals are only read, never modified.
//
//   npm run assets          -> images + logo + video
//   npm run assets -- --no-video
//
// Re-run it whenever you add or replace a photo (see CLAUDE.md).

import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import ffmpegPath from "ffmpeg-static"
import sharp from "sharp"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SRC = path.join(ROOT, "public")
const OUT = path.join(SRC, "assets")
const MANIFEST = path.join(ROOT, "src", "data", "generated", "images.json")
const withVideo = !process.argv.includes("--no-video")

/** Widths generated for photos. Never upscaled past the original. */
const PHOTO_WIDTHS = { lg: 2000, md: 1200, sm: 480 }

/**
 * Milestone groups: `match` finds the original files in public/, `slug` is the
 * safe output name. The base file becomes -01, "(2)" becomes -02, and so on.
 */
const MILESTONES = [
  { slug: "asics-golden-run-21k", match: /^Asics Golden Run 21K/ },
  { slug: "corrida-canina-2k", match: /^Corrida Canina 2K/ },
  { slug: "corrida-mapocho-rio-arriba-10k", match: /^Corrida Mapocho Rio Arriba 10K/ },
  { slug: "corrida-pride-run-7k", match: /^Corrida Pride Run 7K/ },
  { slug: "cumbre-cerro-leoneras", match: /^Cumbre Cerro Leoneras/ },
  { slug: "gp-parque-cordillera", match: /^GP Parque Cordillera/ },
  { slug: "trekking-riscos-del-sauce", match: /^Trekking Riscos del Sauce/ },
  { slug: "marley-coffee-stgo-10k", match: /^Marley Coffe Stgo 10K/ },
  { slug: "torres-del-paine", match: /^Torres del Paine/ },
]

/**
 * Animal illustrations. `cutout` removes a flat white/checkerboard background
 * connected to the image border; `cropBottom` trims a baked-in signature (the
 * credit is shown as text instead); `plate` keeps the image as a full plate.
 */
const ANIMALS = [
  { file: "CONDOR.png", slug: "condor", cutout: true },
  { file: "conejo.avif", slug: "conejo", cutout: { minLight: 222, maxSat: 7 } },
  { file: "fauna.jpeg", slug: "aves-lamina", cutout: true },
  { file: "multiples pajaritos.png", slug: "aves-fiordo-comau", plate: true },
  { file: "pajarito1.png", slug: "zorzal", cropBottom: 0.1 },
  { file: "pajarito2.png", slug: "cometocino-patagonico", cropBottom: 0.1 },
  { file: "pajarito3.png", slug: "cometocino-de-gay", cropBottom: 0.1 },
  { file: "pajarito4.jpeg", slug: "picaflor", cutout: { minLight: 226, maxSat: 12 } },
  { file: "pajarito5.jpeg", slug: "abejaruco", cutout: true },
  { file: "puma.avif", slug: "puma", cutout: true },
]

/** Warm "field notebook" paper used behind animals in the gallery plates. */
const PAPER = { r: 239, g: 233, b: 220 }

const manifest = {}
const rel = (p) => "/" + path.relative(SRC, p).split(path.sep).join("/")
const ensure = (dir) => mkdirSync(dir, { recursive: true })

/** "Name (3).jpeg" / "Name(3).jpeg" -> 3, "Name.jpeg" -> 1 */
const ordinal = (file) => Number(/\((\d+)\)\.[a-z]+$/i.exec(file)?.[1] ?? 1)

async function photo(input, outDir, slug) {
  ensure(outDir)
  const meta = await sharp(input).rotate().metadata()
  const srcW = meta.autoOrient?.width ?? meta.width
  const entry = { variants: {} }
  for (const [key, max] of Object.entries(PHOTO_WIDTHS)) {
    const file = path.join(outDir, `${slug}-${key}.webp`)
    const info = await sharp(input)
      .rotate()
      .resize({ width: Math.min(max, srcW), withoutEnlargement: true })
      .webp({ quality: key === "sm" ? 70 : 78, effort: 5 })
      .toFile(file)
    entry.variants[key] = { src: rel(file), width: info.width, height: info.height }
  }
  entry.width = entry.variants.lg.width
  entry.height = entry.variants.lg.height
  return entry
}

/**
 * Flood-fills from every border pixel through "background-looking" pixels
 * (bright and unsaturated, which covers white and fake checkerboards) and
 * makes them transparent, with a 1px soft edge.
 */
async function cutout(input, { minLight = 196, maxSat = 22 } = {}) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const isBg = (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    return Math.min(r, g, b) > minLight && Math.max(r, g, b) - Math.min(r, g, b) < maxSat
  }
  const seen = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x)
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1)
  while (stack.length) {
    const p = stack.pop()
    if (seen[p] || !isBg(p * 4)) continue
    seen[p] = 1
    const x = p % w
    if (x > 0) stack.push(p - 1)
    if (x < w - 1) stack.push(p + 1)
    if (p >= w) stack.push(p - w)
    if (p < w * (h - 1)) stack.push(p + w)
  }
  for (let p = 0; p < w * h; p++) {
    if (seen[p]) {
      data[p * 4 + 3] = 0
      continue
    }
    // Feather pixels that touch the background.
    const x = p % w
    const edge =
      (x > 0 && seen[p - 1]) || (x < w - 1 && seen[p + 1]) || seen[p - w] || seen[p + w]
    if (edge) data[p * 4 + 3] = 140
  }
  return sharp(data, { raw: info }).png().toBuffer()
}

/** Removes small opaque islands (stray pixels left by the source's alpha). */
async function dropSpecks(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const label = new Int32Array(w * h).fill(-1)
  const sizes = []
  for (let s = 0; s < w * h; s++) {
    if (label[s] !== -1 || data[s * 4 + 3] < 24) continue
    const id = sizes.length
    let n = 0
    const stack = [s]
    label[s] = id
    while (stack.length) {
      const p = stack.pop()
      n++
      const x = p % w
      for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]) {
        if (q < 0 || q >= w * h || label[q] !== -1 || data[q * 4 + 3] < 24) continue
        label[q] = id
        stack.push(q)
      }
    }
    sizes.push(n)
  }
  const keep = Math.max(...sizes, 0) * 0.01
  for (let p = 0; p < w * h; p++) if (label[p] >= 0 && sizes[label[p]] < keep) data[p * 4 + 3] = 0
  return sharp(data, { raw: info }).png().toBuffer()
}

async function animals() {
  const dir = path.join(OUT, "animales")
  ensure(dir)
  for (const a of ANIMALS) {
    const input = path.join(SRC, "animales", a.file)
    let buf = await sharp(input).rotate().toBuffer()
    if (a.cropBottom) {
      const m = await sharp(buf).metadata()
      buf = await sharp(buf)
        .extract({ left: 0, top: 0, width: m.width, height: Math.round(m.height * (1 - a.cropBottom)) })
        .toBuffer()
    }
    if (a.cutout) buf = await cutout(buf, a.cutout === true ? undefined : a.cutout)
    if (!a.plate) buf = await sharp(await dropSpecks(buf)).trim({ threshold: 1 }).toBuffer()

    const entry = { variants: {} }
    // Decorative cutout (transparent) for the side decorations.
    const cut = path.join(dir, `${a.slug}.webp`)
    const ci = await sharp(buf)
      .resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, alphaQuality: 90, effort: 5 })
      .toFile(cut)
    entry.variants.cutout = { src: rel(cut), width: ci.width, height: ci.height }

    // Gallery plate: the animal centered on paper, a fixed 16:10 frame so the
    // morph gallery never crops a beak or a wing.
    const W = 1600, H = 1000
    const inner = await sharp(buf)
      .resize({ width: Math.round(W * (a.plate ? 0.94 : 0.62)), height: Math.round(H * (a.plate ? 0.9 : 0.78)), fit: "inside" })
      .toBuffer()
    const im = await sharp(inner).metadata()
    const plate = path.join(dir, `${a.slug}-plate.webp`)
    const pi = await sharp({ create: { width: W, height: H, channels: 3, background: PAPER } })
      .composite([{ input: inner, left: Math.round((W - im.width) / 2), top: Math.round((H - im.height) / 2) }])
      .webp({ quality: 80, effort: 5 })
      .toFile(plate)
    entry.variants.plate = { src: rel(plate), width: pi.width, height: pi.height }
    const thumb = path.join(dir, `${a.slug}-plate-sm.webp`)
    const ti = await sharp(plate).resize({ width: 320 }).webp({ quality: 70 }).toFile(thumb)
    entry.variants.plateSm = { src: rel(thumb), width: ti.width, height: ti.height }
    entry.width = ci.width
    entry.height = ci.height
    manifest[`animales/${a.slug}`] = entry
  }
}

async function milestones() {
  const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f))
  for (const m of MILESTONES) {
    const group = files.filter((f) => m.match.test(f)).sort((a, b) => ordinal(a) - ordinal(b))
    if (group.length === 0) throw new Error(`No files for milestone ${m.slug}`)
    for (const f of group) {
      const n = String(ordinal(f)).padStart(2, "0")
      const key = `hitos/${m.slug}-${n}`
      manifest[key] = { original: f, ...(await photo(path.join(SRC, f), path.join(OUT, "hitos"), `${m.slug}-${n}`)) }
    }
  }
}

async function profileAndLogo() {
  manifest["perfil/alberto-astudillo"] = await photo(
    path.join(SRC, "foto_perfil_pagina.jpeg"),
    path.join(OUT, "perfil"),
    "alberto-astudillo",
  )

  // Logo: the source is a circular emblem on a white square. Cut it to the
  // circle so it sits on any background without a white box.
  const dir = path.join(OUT, "logo")
  ensure(dir)
  const src = path.join(SRC, "LOGO-A.A.png")
  const { width } = await sharp(src).metadata()
  const r = width * 0.497
  const mask = Buffer.from(
    `<svg width="${width}" height="${width}"><circle cx="${width / 2}" cy="${width / 2}" r="${r}" fill="#fff"/></svg>`,
  )
  const round = await sharp(src).ensureAlpha().composite([{ input: mask, blend: "dest-in" }]).png().toBuffer()
  const sizes = { "logo-512.webp": 512, "logo-192.png": 192, "logo-180.png": 180, "logo-64.png": 64, "logo-32.png": 32 }
  for (const [name, s] of Object.entries(sizes)) {
    const img = sharp(round).resize(s, s)
    await (name.endsWith(".webp") ? img.webp({ quality: 85 }) : img.png({ compressionLevel: 9 })).toFile(path.join(dir, name))
  }
  manifest["logo"] = { width: 512, height: 512, variants: { md: { src: "/assets/logo/logo-512.webp", width: 512, height: 512 } } }

  // Open Graph image (1200x630) from the Torres del Paine towers photo.
  await sharp(path.join(SRC, "Torres del Paine (4).jpeg"))
    .rotate()
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, "og-image.jpg"))
}

function video() {
  const dir = path.join(OUT, "video")
  ensure(dir)
  const input = path.join(SRC, "video_landing", "video_landing.mp4")
  const run = (args) => execFileSync(ffmpegPath, ["-y", "-hide_banner", "-loglevel", "error", "-i", input, ...args])
  const poster = path.join(dir, "landing-poster.jpg")
  run(["-frames:v", "1", "-q:v", "3", poster])
  // Muted background loop: audio is dropped, faststart lets it play while loading.
  run(["-an", "-vf", "scale=1920:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(dir, "landing-1080.mp4")])
  run(["-an", "-vf", "scale=1280:-2", "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(dir, "landing-720.mp4")])
  run(["-an", "-vf", "scale=1920:-2", "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "4", path.join(dir, "landing-1080.webm")])
  return sharp(poster)
    .webp({ quality: 75 })
    .toFile(path.join(dir, "landing-poster.webp"))
    .then((i) => {
      manifest["video/poster"] = { width: i.width, height: i.height, variants: { lg: { src: "/assets/video/landing-poster.webp", width: i.width, height: i.height } } }
    })
}

await milestones()
await animals()
await profileAndLogo()
if (withVideo) await video()
else if (!existsSync(path.join(OUT, "video", "landing-poster.webp"))) console.warn("Video assets missing: run without --no-video once.")

ensure(path.dirname(MANIFEST))
// Keep keys sorted so diffs stay readable.
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)))
if (!withVideo && existsSync(MANIFEST)) {
  const prev = JSON.parse((await import("node:fs")).readFileSync(MANIFEST, "utf8"))
  if (prev["video/poster"]) sorted["video/poster"] = prev["video/poster"]
}
writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + "\n")
console.log(`Wrote ${Object.keys(sorted).length} entries to ${path.relative(ROOT, MANIFEST)}`)
