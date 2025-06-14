<script setup lang="ts">
import { type HTMLAttributes, onMounted, onUnmounted, ref } from 'vue'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './shadcn-vue/tabs'

const prop = defineProps<{
  // 解法列表
  solutions: Array<{
    // a标签跳转标志位
    id: string
    // 解法
    title: string
  }>
  defaultSolution: string
  class?: HTMLAttributes['class']
}>()
// 动态修改TabsTrigger
const defaultSolutionRef = ref(prop.defaultSolution)

// 监听链接a标签锚点标志位
onMounted(() => {
  window.addEventListener(
    'hashchange',
    () => {
      const hash = window.location.hash.slice(1)
      for (const l of prop.solutions) {
        if (hash === l.id) {
          defaultSolutionRef.value = l.title
        }
      }
    },
    false
  )
})
onUnmounted(() => {
  window.removeEventListener('hashchange', () => {})
})
</script>

<template>
  <section class="strat-section content-section grid">
    <Tabs v-model:model-value="defaultSolutionRef" :default-value="defaultSolution">
      <TabsList class="ml-68 flex flex-row gap-4">
        <TabsTrigger v-for="l in solutions" :key="l.title" as="a" :href="`#${l.id}`" :value="l.title">
          {{ l.title }}
        </TabsTrigger>
      </TabsList>
      <TabsContent v-for="l in solutions" :key="l.title" class="mt-4" :value="l.title">
        <slot :name="l.title" />
      </TabsContent>
    </Tabs>
  </section>
</template>
