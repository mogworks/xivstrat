<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@xivstrat/shadcn-vue'
import type { HTMLAttributes } from 'vue'

import Buff from '@/components/Buff.vue'
import Span from '@/components/Span.vue'
import type { VariantType } from '@/lib/variant'

const props = defineProps<{
  icon: string
  name: string
  nameVariant: VariantType
  description: string
  tag?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <Buff :icon="icon" :name="name" :description="description" :tag="tag" :class="props.class">
        <slot name="icon">
          <img :src="icon" :alt="description">
        </slot>
      </Buff>
    </HoverCardTrigger>
    <HoverCardContent class="w-auto max-w-150">
      <div class="space-y-2">
        <h4 class="flex items-center gap-2 text-lg font-semibold">
          <Buff :icon="icon" :name="name" :description="description">
            <slot name="icon">
              <img :src="icon" :alt="description">
            </slot>
          </Buff>
          <Span :variant="nameVariant">{{ name }}</Span>
        </h4>
        <slot>
          <p>
            {{ description }}
          </p>
        </slot>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>
