import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const BASE = '/swara-sadhana/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png', 'art/*.jpg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,woff2,json}'],
        navigateFallback: `${BASE}index.html`,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'Swara Sadhana — Carnatic Vocal Practice',
        short_name: 'Swara Sadhana',
        description:
          'Daily Carnatic vocal training: pitch feedback, tala practice, and sadhana tracking.',
        theme_color: '#0c0a09',
        background_color: '#0c0a09',
        display: 'standalone',
        orientation: 'any',
        start_url: BASE,
        scope: BASE,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  build: {
    target: 'es2022',
  },
})
