<script setup lang="ts">
import { type HTMLAttributes, onMounted, onUnmounted, ref } from 'vue'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn-vue/tabs'

const prop = defineProps<{
  solutions: {
    id: string // 必须唯一
    title: string // 必须唯一
  }[]
  defaultSolution: string // title
  class?: HTMLAttributes['class']
}>()
const defaultSolutionRef = ref(prop.defaultSolution)

// 处理 hash 变化的函数
const handleHashChange = () => {
  const hash = window.location.hash.slice(1)
  for (const l of prop.solutions) {
    if (hash === l.id) {
      defaultSolutionRef.value = l.title
      break
    }
  }
}

onMounted(() => {
  // 组件挂载时立即检查 hash
  handleHashChange()

  // 监听 hash 变化
  window.addEventListener('hashchange', handleHashChange, false)
  // 监听历史记录变化（处理浏览器的前进/后退按钮）
  window.addEventListener('popstate', handleHashChange, false)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange)
  window.removeEventListener('popstate', handleHashChange)
})
</script>

<template>
  <div v-for="l in solutions" :id="l.id" :key="l.id" class="-mb-(--article-row-gap) h-0 scroll-mt-[calc(5rem+1px)]" />
  <section class="strat-section content-section multi-solution-section ml-64 grid grid-cols-1 px-4 text-base">
    <Tabs v-model:model-value="defaultSolutionRef" :default-value="defaultSolution">
      <TabsList class="border border-dashed">
        <TabsTrigger
          v-for="l in solutions"
          :key="l.id"
          :value="l.title"
          class="cursor-pointer data-[state=active]:border-lime-700/50 data-[state=active]:text-lime-700 data-[state=active]:[text-shadow:_0_0_1px_var(--color-lime-600)] dark:data-[state=active]:border-lime-600/50 dark:data-[state=active]:text-lime-400"
        >
          {{ l.title }}
        </TabsTrigger>
      </TabsList>
      <TabsContent v-for="l in solutions" :key="l.id" :value="l.title">
        <div
          class="bg-card/95 text-card-foreground relative h-full w-full rounded-lg border border-dashed border-lime-700/25 px-4 py-6 dark:border-lime-700/50"
        >
          <slot :name="l.title" />
        </div>
      </TabsContent>
    </Tabs>
  </section>
</template>
