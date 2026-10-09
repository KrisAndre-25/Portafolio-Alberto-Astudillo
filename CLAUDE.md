# Portafolio Alberto Astudillo

One-page portfolio for Alberto Astudillo (guardaparque, Torres del Paine). Site copy in Spanish (Chile); code, file names and commits in English.

## Stack
- Vite 8 + React 19 + TypeScript 6, Tailwind CSS v4 (`@tailwindcss/vite`), shadcn (`components.json`, alias `@/` → `src/`).
- Animation: `motion` (dock, 3D card, parallax), GSAP + ScrollTrigger (footer only), raw WebGL (fauna gallery).
- Icons: `@tabler/icons-react`. Fonts: Fraunces (headings) + Geist (text) via Fontsource.
- npm. Lint: oxlint. No backend.

## Commands
- `npm run dev` · `npm run build` (tsc + vite + pre-render of the hero) · `npm run preview`
- `npm run typecheck` · `npm run lint` — run both plus `build` before every commit.
- `npm run assets` — regenerate optimized images/video from `public/` (`-- --no-video` to skip video).
- `python scripts/generate-cert-thumbs.py` — certificate copies (RUT covered) + thumbnails.
- `npm run cv` — rebuild the CV PDF from `scripts/cv/cv.html`.
- `node scripts/screenshots.mjs <url> <outDir> [--full] [--contrast] [--widths=360,1280]` — visual check.

## Structure
```
src/
  App.tsx                 hero in main bundle; chrome, sections, footer lazy after hydration
  index.html              theme script, loading screen (inline), font preloads
  config/site.config.ts   ALL editable copy, links, availability, footer credit (PENDIENTE = placeholder)
  config/sections.ts      section ids/titles/icons for the dock
  data/                   typed manifests: milestones, animals, certificates, skills, images
  data/generated/*.json   written by the scripts, do not edit by hand
  components/ui/          third-party components (Aceternity/21st, adapted) + FrameButton, ModalDialog, Lightbox
  components/sections/    Hero, About, Experience (timeline), Skills, Milestones, Fauna, Certifications, Contact
  components/layout/      Navbar (top dock), SectionRail, ScrollProgress, Reveal, AnimalDecor, SectionHeading
  components/decor/       hand-drawn SVG mountains and botanicals
  hooks/                  media queries, a11y theme, active section, hydration
public/                   ORIGINALS (not committed, not deployed) + assets/ (optimized, committed)
referencias/              components exactly as pasted by the user (not built)
scripts/                  asset, certificate, CV, pre-render and screenshot scripts
```

## Conventions
- Never hardcode colours: use tokens from `src/index.css` (`bg-background`, `text-sand`, `bg-moss`…). Every token is remapped in the high-contrast theme (`[data-theme="contrast"]`, Tailwind variant `contrast:`). State must never rely on colour alone.
- Respect `prefers-reduced-motion` in anything that moves.
- CTAs use `FrameButton` (`@/components/ui/frame-button`, variants light/dark/moss), never styled-components.
- Do not invent facts about Alberto: text comes from his CV or `site.config.ts`.
- Commits: Conventional Commits, authored by the repo owner, with no AI attribution lines.

## Adding content
- **Milestone photo**: drop the JPEG in `public/` using the existing naming (`Name (n).jpeg`), add/adjust the group in `MILESTONES` in `scripts/optimize-images.mjs`, run `npm run assets -- --no-video`, then add one alt text per photo in `src/data/milestones.ts` (date/description are optional fields).
- **Animal**: add the file to `public/animales/`, add it to `ANIMALS` in the optimize script (set `cutout` if it has a white background), run the script, add the entry in `src/data/animals.ts`.
- **Certificate**: put the file in `Certificaciones/Certificaciones/`, add `slug: filename` to `FILES` in `scripts/generate-cert-thumbs.py`, run it, add title/issuer/date in `src/data/certificates.ts`.
- **Experience timeline**: `src/data/experience.ts` (parks / adventure tourism only, from the CV).
- **Text, links, availability, footer credit**: `src/config/site.config.ts`.
