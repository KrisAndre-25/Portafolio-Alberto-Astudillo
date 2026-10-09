// Visual check: full-page and viewport screenshots at the target widths.
//   node scripts/screenshots.mjs <url> <outDir> [--contrast] [--widths=360,1280] [--full]
import { mkdirSync } from "node:fs"
import { chromium } from "playwright"

const [url = "http://localhost:5173", outDir = "screenshots"] = process.argv.slice(2).filter((a) => !a.startsWith("--"))
const flag = (name) => process.argv.find((a) => a.startsWith(`--${name}`))
const widths = (flag("widths")?.split("=")[1] ?? "360,390,768,1024,1280,1536").split(",").map(Number)
const contrast = Boolean(flag("contrast"))
const full = Boolean(flag("full"))
const reduced = Boolean(flag("reduced"))
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
for (const width of widths) {
  const height = width < 768 ? 800 : width < 1280 ? 1000 : 900
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: reduced ? "reduce" : "no-preference" })
  const errors = []
  page.on("pageerror", (e) => errors.push(e.message))
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
  if (contrast) await page.addInitScript(() => localStorage.setItem("aa-theme", "contrast"))
  await page.goto(url, { waitUntil: "networkidle" })
  // Scroll through once so reveal-on-scroll content is shown in full-page shots.
  if (full) {
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 60))
      }
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(600)
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  const name = `${outDir}/${width}${contrast ? "-contrast" : ""}${full ? "-full" : ""}.png`
  await page.screenshot({ path: name, fullPage: full })
  console.log(`${name}  horizontal-overflow=${overflow}px  errors=${errors.length ? errors.join(" | ") : 0}`)
  await page.close()
}
await browser.close()
