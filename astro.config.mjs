import { defineConfig } from 'astro/config'

import icon from 'astro-icon'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  site: 'https://alexpassalis.dev',
  base: '/',
  trailingSlash: 'never',
  output: 'static',
  integrations: [icon({ include: { mdi: ['*'] } })],
  prefetch: true,
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: 'compile',
  }),
  vite: {
    plugins: [tailwindcss()],
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },
  },
})
