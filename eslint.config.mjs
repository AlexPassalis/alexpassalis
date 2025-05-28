import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'app',
    typescript: true,
    formatters: true,
    stylistic: {
      indent: 2,
      semi: false,
      quotes: 'single',
    },
  },
  {
    rules: {
      'format/prettier': 'off',
      'style/quote-props': ['error', 'as-needed'],
      'antfu/consistent-chaining': 'off',
      'object-shorthand': 'off',
      'comma-dangle': 'off',
      'jsonc/comma-dangle': 'off',
      'style/comma-dangle': 'off',
      'style/arrow-parens': ['error', 'always'],
      'style/member-delimiter-style': 'off',
      'style/brace-style': 'off',
      'style/operator-linebreak': 'off',
      'ts/no-redeclare': 'off',
      'ts/consistent-type-definitions': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'antfu/no-top-level-await': ['off'],
      'node/prefer-global/process': ['off'],
      'node/no-process-env': ['error'],
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'perfectionist/sort-named-exports': 'off',
      'import/no-duplicates': 'off',
      'regexp/prefer-w': 'off',
      'regexp/no-useless-escape': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'style/multiline-ternary': 'off',
    },
  },
  {
    files: [
      'src/utils/readSecret.ts',
      'src/data/env/envServer.ts',
      'src/data/env/envClient.ts',
    ],
    rules: {
      'node/no-process-env': 'off',
    },
  },
)
