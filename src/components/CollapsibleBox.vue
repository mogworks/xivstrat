<script setup lang="ts">
import { ChevronsUpDown } from 'lucide-vue-next'
import { type HTMLAttributes, ref } from 'vue'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/shadcn-vue/collapsible'
import { Separator } from '@/components/shadcn-vue/separator'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    defaultStatus?: boolean
  }>(),
  {
    defaultStatus: true,
  }
)

const isOpen = ref(props.defaultStatus)
</script>

<template>
  <div :class="cn('bg-card w-min min-w-[350px] rounded-lg border p-4 shadow-md', props.class)">
    <Collapsible v-model:open="isOpen">
      <div class="mb-0 flex items-center justify-between text-2xl font-bold capitalize">
        <slot name="header" />
        <CollapsibleTrigger as-child>
          <slot name="trigger">
            <button variant="ghost" size="sm" class="cursor-pointer p-0">
              <ChevronsUpDown class="h-4 w-4" />
              <span class="sr-only">展开/收缩</span>
            </button>
          </slot>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <Separator class="my-4 mb-3" />
        <div>
          <slot />
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
