// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],
  vite: { server: { watch: { usePolling: true } } },
  srcDir: 'src',
  dir: { app: 'app', pages: 'app/pages' },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  typescript: {
    typeCheck: true,
    strict: true,
  },
  tailwindcss: {
    cssPath: 'src/app/assets/css/tailwind.css',
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
})
