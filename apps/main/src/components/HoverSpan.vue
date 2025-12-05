<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import type { VariantType } from '@/lib/variant'

import Span from '@/components/Span.vue'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@xivstrat/shadcn-vue'

const props = defineProps<{
  variant: VariantType
  text: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <Span :variant="variant" :class="props.class">{{ text }}</Span>
    </HoverCardTrigger>
    <HoverCardContent class="w-auto">
      <div class="flex flex-col gap-2">
        <h4 class="text-lg font-semibold">
          <Span :variant="variant" :class="props.class">{{ text }}</Span>
        </h4>
        <slot />
      </div>
    </HoverCardContent>
  </HoverCard>
</template>
