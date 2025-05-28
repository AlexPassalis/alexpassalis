import { defineConfig } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'
import icon from 'astro-icon'

export default defineConfig({
  site: 'https://alexpassalis.com',
  base: '/',
  trailingSlash: 'never',
  output: 'static',
  integrations: [icon({ include: { mdi: ['*'] } })],
  prefetch: true,
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true,
    },
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
