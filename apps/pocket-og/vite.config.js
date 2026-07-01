import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))
let sha = process.env.VERCEL_GIT_COMMIT_SHA || ''
try { if (!sha) sha = execSync('git rev-parse HEAD').toString().trim() } catch { /* not a git checkout */ }
const buildInfo = {
  version: pkg.version,
  sha: sha ? sha.slice(0, 7) : 'dev',
  date: new Date().toISOString().slice(0, 10),
}

export default defineConfig({
  define: {
    __BUILD_INFO__: JSON.stringify(buildInfo),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'fonts/Geist-Variable.woff2'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Don't serve the SPA shell for real files opened as navigations
        // (e.g. guideline PDFs in a new tab) — let them hit the actual asset.
        navigateFallbackDenylist: [/^\/guidelines\//, /\.pdf$/],
      },
      manifest: {
        name: 'Pocket O&G',
        short_name: 'Pocket O&G',
        description: 'Clinical decision support for obstetrics and gynaecology trainees',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
