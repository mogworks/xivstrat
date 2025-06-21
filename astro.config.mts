import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  site: 'https://xivstrat.com',

  integrations: [vue()],

  vite: {
    plugins: [tailwindcss(), svgLoader()],
  },

  image: {
    layout: 'constrained',
  },
})
