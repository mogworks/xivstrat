<script setup lang="ts">
import { type HTMLAttributes, onMounted, onUnmounted, ref } from 'vue'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './shadcn-vue/tabs'

const prop = defineProps<{
  // 解法列表
  solutionList: Array<{
    // 解法
    solution: string
    // a标签跳转标志位
    href: string
  }>
  defaultSolution: string
  class?: HTMLAttributes['class']
}>()
// 动态修改TabsTrigger
const defaultSolutionRef = ref(prop.defaultSolution)

// 监听链接a标签锚点标志位
onMounted(() => {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash
    for (const l of prop.solutionList) {
      if (hash === l.href) {
        defaultSolutionRef.value = l.solution
      }
    }
  }, false)
})
onUnmounted(() => {
  window.removeEventListener('hashchange', () => { })
})
</script>

<template>
  <section class="strat-section content-section">
    <Tabs v-model:model-value="defaultSolutionRef" :default-value="defaultSolution">
      <TabsList class="flex flex-row gap-4 ml-68">
        <TabsTrigger v-for="l in solutionList" :key="l.solution" as="a" :href="l.href" :value="l.solution">
          {{ l.solution }}
        </TabsTrigger>
      </TabsList>
      <TabsContent v-for="l in solutionList" :key="l.solution" class="mt-2" :value="l.solution">
        <slot :name="l.solution" />
      </TabsContent>
    </Tabs>
  </section>
</template>
