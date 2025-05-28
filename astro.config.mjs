import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'
import icon from 'astro-icon'

export default defineConfig({
  site: 'https://alexpassalis.com',
  base: '/',
  trailingSlash: 'never',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },
  },
  integrations: [icon({ include: { mdi: ['*'] } })],
  prefetch: true,
})
