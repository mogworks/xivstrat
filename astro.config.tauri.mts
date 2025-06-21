import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  site: 'https://xivstrat.com',

  // 为 Tauri 应用设置相对路径
  base: './',

  integrations: [vue()],

  vite: {
    plugins: [tailwindcss(), svgLoader()],
  },
})
