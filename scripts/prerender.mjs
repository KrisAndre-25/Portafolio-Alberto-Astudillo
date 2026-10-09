// Pre-renders the first screen into dist/index.html after `vite build`, so the
// hero text paints from HTML + CSS before any JavaScript runs. Lazy sections
// are rendered as their Suspense fallbacks and filled in on the client
// (main.tsx hydrates instead of re-creating the DOM).

import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createElement } from "react"
import { renderToString } from "react-dom/server"
import { createServer } from "vite"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const html = path.join(ROOT, "dist", "index.html")

const vite = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: "custom", logLevel: "error" })
try {
  const { default: App } = await vite.ssrLoadModule("/src/App.tsx")
  const markup = renderToString(createElement(App))
  const page = readFileSync(html, "utf8")
  if (!page.includes('<div id="root"></div>')) throw new Error("root container not found in dist/index.html")
  writeFileSync(html, page.replace('<div id="root"></div>', `<div id="root">${markup}</div>`))
  console.log(`Pre-rendered ${(markup.length / 1024).toFixed(1)} KB into dist/index.html`)
} finally {
  await vite.close()
}
