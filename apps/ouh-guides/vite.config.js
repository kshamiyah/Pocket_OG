import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// OUH Guides reuses Pocket O&G's own components and styles from
// ../pocket-og/src, so both apps look and behave the same, and OUH content
// can later be merged into Pocket O&G without changing its format.
export default defineConfig({
  server: { fs: { allow: ['..', '../..'] } },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'fonts/Geist-Variable.woff2'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,jpg}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        // Cited guideline pages open as real files, not the app shell.
        navigateFallbackDenylist: [/^\/sources\//],
      },
      manifest: {
        name: 'OUH Guides',
        short_name: 'OUH Guides',
        description: 'Oxford University Hospitals local O&G guidelines as interactive pathways',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
