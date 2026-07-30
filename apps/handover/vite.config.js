import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'fonts/Geist-Variable.woff2'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Let standalone static pages (early-access, privacy, support) bypass the SPA shell.
        navigateFallbackDenylist: [/^\/early-access(\.html)?$/, /^\/privacy\.html$/, /^\/support\.html$/],
      },
      manifest: {
        name: 'Handover',
        short_name: 'Handover',
        description: 'A shift job list that hands over with a scan — no names, no beds, no server.',
        theme_color: '#fbe9e7',
        background_color: '#fbe9e7',
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
