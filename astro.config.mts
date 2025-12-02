import node from '@astrojs/node'
import react from '@astrojs/react'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  site: 'https://xivstrat.cn',

  integrations: [
    vue(),
    react({
      experimentalReactChildren: true,
    }),
  ],

  vite: {
    plugins: [tailwindcss(), svgLoader()],
  },

  image: {
    domains: ['xivstrat.cn'],
    layout: 'constrained',
  },

  adapter: node({
    mode: 'standalone',
    // EdgeOne 不支持缓存流式HTML
    experimentalDisableStreaming: true,
  }),
})
