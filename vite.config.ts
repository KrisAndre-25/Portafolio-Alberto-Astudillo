import { readdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * public/ also holds the original, unoptimized photos, video, CV and logo.
 * The site only uses the optimized copies in public/assets/, so everything
 * else Vite copied into dist/ is removed after the build.
 */
function publishOnlyOptimizedAssets(): Plugin {
  const keep = new Set(['index.html', 'static', 'assets', 'robots.txt'])
  let outDir = 'dist'
  return {
    name: 'publish-only-optimized-assets',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      for (const entry of readdirSync(outDir)) {
        if (!keep.has(entry)) rmSync(path.join(outDir, entry), { recursive: true, force: true })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), publishOnlyOptimizedAssets()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Keep bundled JS/CSS apart from public/assets (optimized media).
    assetsDir: 'static',
  },
})
