// Prints scripts/cv/cv.html to public/assets/cv/CV-Alberto-Astudillo-<mes-año>.pdf
// with headless Chromium (Playwright), plus PNG previews for checking.
//   npm run cv
// The file name must match siteConfig.cv.href (src/config/site.config.ts).

import { mkdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { chromium } from "playwright"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SRC = path.join(ROOT, "scripts", "cv", "cv.html")
const OUT_DIR = path.join(ROOT, "public", "assets", "cv")
const NAME = "CV-Alberto-Astudillo-octubre-2026"
const previewDir = process.argv[2]

mkdirSync(OUT_DIR, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(pathToFileURL(SRC).href, { waitUntil: "networkidle" })
await page.evaluate(() => document.fonts.ready)

// Fail loudly if a column runs past the bottom of its page.
const overflow = await page.evaluate(() =>
  [...document.querySelectorAll(".page")].flatMap((p, i) => {
    const bottom = p.getBoundingClientRect().bottom
    return [...p.querySelectorAll(".col")]
      .filter((c) => c.getBoundingClientRect().bottom > bottom - 8)
      .map(() => `page ${i + 1}`)
  }),
)
if (overflow.length) throw new Error(`CV content overflows: ${overflow.join(", ")}`)

const pdf = path.join(OUT_DIR, `${NAME}.pdf`)
await page.pdf({ path: pdf, format: "Letter", printBackground: true, preferCSSPageSize: true })
console.log(`Wrote ${path.relative(ROOT, pdf)}`)

if (previewDir) {
  mkdirSync(previewDir, { recursive: true })
  await page.setViewportSize({ width: 816, height: 1056 })
  const pages = await page.locator(".page").all()
  for (const [i, p] of pages.entries()) await p.screenshot({ path: path.join(previewDir, `cv-page-${i + 1}.png`) })
}
await browser.close()
