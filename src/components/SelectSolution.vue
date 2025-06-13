<script setup lang="ts">
import { type HTMLAttributes, onMounted, onUnmounted, ref } from 'vue'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './shadcn-vue/tabs'

const prop = defineProps<{
  solutionList: Array<{
    name: string
    href: string
  }>
  defaultSolution: string
  class?: HTMLAttributes['class']
}>()

const defaultNameRef = ref(prop.defaultSolution)

onMounted(() => {
  window.addEventListener(
    'hashchange',
    (_e) => {
      // 修改当前解法
      const hash = window.location.hash
      for (const l of prop.solutionList) {
        if (hash === l.href) {
          defaultNameRef.value = l.name
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
  <Tabs v-model:model-value="defaultNameRef" :default-value="defaultSolution">
    <TabsList class="ml-68 flex flex-row gap-4">
      <TabsTrigger v-for="l in solutionList" :key="l.name" :value="l.name">
        {{ l.name }}
      </TabsTrigger>
    </TabsList>
    <TabsContent v-for="l in solutionList" :key="l.name" class="mt-2" :value="l.name">
      <slot :name="l.name" />
    </TabsContent>
  </Tabs>
</template>
