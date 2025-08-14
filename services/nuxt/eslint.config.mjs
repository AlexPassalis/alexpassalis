// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  overrides: [
    {
      files: ['nuxt.config.ts'],
      rules: {
        'nuxt/nuxt-config-keys-order': 'off',
      },
    },
  ],
})
