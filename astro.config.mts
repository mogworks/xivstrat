import react from '@astrojs/react'
import vue from '@astrojs/vue'
import edgeoneAdapter from '@edgeone/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, passthroughImageService } from 'astro/config'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  site: 'https://xivstrat.cn',

  adapter: edgeoneAdapter(),

  integrations: [
    vue(),
    react({
      experimentalReactChildren: true,
    }),
  ],

  vite: {
    plugins: [tailwindcss(), svgLoader()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/better-auth-localization')) return 'vendor-auth-i18n'
            if (id.includes('node_modules/better-auth')) return 'vendor-auth'
            if (id.includes('node_modules/motion')) return 'vendor-motion'
            if (id.includes('node_modules/pinyin-pro')) return 'vendor-pinyin'
            if (id.includes('node_modules/pixi-filters')) return 'vendor-pixi-filters'
            if (id.includes('node_modules/pixi.js')) return 'vendor-pixi'
            if (id.includes('node_modules/react')) return 'vendor-react'
            if (id.includes('node_modules/shadcn')) return 'vendor-shadcn'
            if (id.includes('node_modules/vue')) return 'vendor-vue'
            if (id.includes('node_modules/zod')) return 'vendor-zod'
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  },

  image: {
    // EdgeOne Pages 暂不支持 <Image /> 组件
    // 参考1：https://docs.astro.build/en/guides/images/#configure-no-op-passthrough-service
    // 参考2：https://edgeone.cloud.tencent.com/pages/document/194734898363867136
    service: passthroughImageService(),
  },
})
