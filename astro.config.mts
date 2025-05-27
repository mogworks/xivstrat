import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://xivstrat.com',

  integrations: [vue()],

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    locales: ['en', 'zh', 'ja'],
    defaultLocale: 'zh',
    routing: {
      prefixDefaultLocale: true,
    },
  },
})
