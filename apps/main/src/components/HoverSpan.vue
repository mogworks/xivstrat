<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@xivstrat/shadcn-vue'
import type { HTMLAttributes } from 'vue'

import Span from '@/components/Span.vue'
import type { VariantType } from '@/lib/variant'

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
