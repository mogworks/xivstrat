import vue from '@astrojs/vue'
import tailwind from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// Electron 专用配置
export default defineConfig({
  integrations: [vue()],
  vite: {
    plugins: [tailwind()],
  },
  // 使用 /. 作为基础路径，这样资源路径会是 /./_astro/...
  // 在 Electron 中会被自定义协议正确处理
  base: '/.',
})
