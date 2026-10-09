// Builds the site for a Claude page (Artifact) into dist-artifact/:
//   npm run build:artifact
// - relative base ("./") so every file resolves under the artifact's sub-path;
// - mode "artifact": certificate PDFs shown as images, CV opens in a new tab
//   (the artifact frame blocks <object> and download links);
// - index.html becomes a fragment (the platform adds <html>, <head>, <body>),
//   with a short name as <title>. No pre-render: the client renders the page.

import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { build } from "vite"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const OUT = path.join(ROOT, "dist-artifact")

await build({ root: ROOT, mode: "artifact", base: "./", logLevel: "warn", build: { outDir: OUT, emptyOutDir: true } })

const html = readFileSync(path.join(OUT, "index.html"), "utf8")
const head = /<head>([\s\S]*?)<\/head>/.exec(html)?.[1] ?? ""
const body = /<body[^>]*>([\s\S]*?)<\/body>/.exec(html)?.[1] ?? ""

const fragment = [
  "<title>Portafolio Alberto Astudillo</title>",
  head
    .replace(/<meta charset[^>]*>\s*/i, "")
    .replace(/<meta name="viewport"[^>]*>\s*/i, "")
    .replace(/<title>[\s\S]*?<\/title>\s*/i, ""),
  // What <html lang> and <body class> did in the normal build.
  '<script>document.documentElement.lang = "es-CL"; document.body.classList.add("grain")</script>',
  body,
]
  .join("\n")
  .replaceAll('"/assets/', '"assets/')

writeFileSync(path.join(OUT, "index.html"), fragment)
console.log(`Artifact build ready in ${path.relative(ROOT, OUT)}/`)
