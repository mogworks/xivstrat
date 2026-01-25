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
  },

  image: {
    // EdgeOne Pages 暂不支持 <Image /> 组件
    // 参考1：https://docs.astro.build/en/guides/images/#configure-no-op-passthrough-service
    // 参考2：https://edgeone.cloud.tencent.com/pages/document/194734898363867136
    service: passthroughImageService(),
  },
})
