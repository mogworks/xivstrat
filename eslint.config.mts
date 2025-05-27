import antfu from '@antfu/eslint-config'

export default antfu(
  {
    lessOpinionated: true,
    astro: true,
    react: false,
    vue: true,
    stylistic: true,
    typescript: true,
    formatters: true,
    ignores: [
      '.assetpack/**/*',
      '.astro/**/*',
      '.vscode/**/*',
      'dist/**/*',
      'node_modules/**/*',
      'public/**/*',
      'src/assets/**/*',
      'package-lock*',
      'pnpm-lock*',
      'bun.lock*',
      'yarn.lock*',
      'Caddyfile',
    ],
  },
  {
    rules: {
      'no-console': 'off',
      'style/brace-style': ['error', '1tbs'],
      'style/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
      'style/operator-linebreak': 'off',
      'perfectionist/sort-imports': ['error', { tsconfigRootDir: '.' }],
      'unicorn/number-literal-case': 'off',
      'style/quotes': ['error', 'single'],
      'style/jsx-quotes': ['error', 'prefer-double'],
      'style/comma-dangle': ['error', 'only-multiline'],
    },
  }
)
