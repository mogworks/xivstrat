<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { ChevronsUpDown } from 'lucide-vue-next'
import { animate } from 'motion-v'
import { ref, useTemplateRef, watch } from 'vue'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/shadcn-vue/collapsible'
import { Separator } from '@/components/shadcn-vue/separator'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    id?: string
    class?: HTMLAttributes['class']
    defaultStatus?: boolean
  }>(),
  {
    defaultStatus: true,
  }
)

const isOpen = ref(props.defaultStatus)
const collapsibleContentRef = useTemplateRef('collapsibleContent')

watch(isOpen, (isOpen) => {
  const content = collapsibleContentRef.value?.$el as HTMLElement
  if (!content) {
    return
  }

  if (isOpen) {
    // 先使元素可见
    content.classList.toggle('hidden', false)
    content.style.height = 'auto'
    // 获取元素高度
    const height = content.offsetHeight
    animate(
      content,
      {
        height: `${height}px`,
        opacity: 1,
      },
      { duration: 0.1, ease: 'easeInOut' }
    )
  } else {
    animate(content, { height: 0, opacity: 0 }, { duration: 0.1, ease: 'easeInOut' }).finished.then(() => {
      // 动画结束使子元素不可交互
      content.classList.toggle('hidden', true)
    })
  }
})
</script>

<template>
  <div
    :class="cn('bg-card w-min min-w-[350px] overflow-hidden rounded-lg border shadow-md hover:shadow-lg', props.class)"
  >
    <div :id="id" class="h-0" />
    <Collapsible v-model:open="isOpen">
      <CollapsibleTrigger
        class="mb-0 flex h-full w-full cursor-pointer items-center justify-between p-4 text-2xl font-bold capitalize hover:bg-zinc-100 dark:hover:bg-zinc-500"
      >
        <slot name="header" />
        <slot name="trigger">
          <div variant="ghost">
            <ChevronsUpDown class="h-4 w-4" />
            <span class="sr-only">展开/收缩</span>
          </div>
        </slot>
      </CollapsibleTrigger>
      <CollapsibleContent ref="collapsibleContent" force-mount>
        <Separator class="mb-3" />
        <div class="p-4">
          <slot />
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
