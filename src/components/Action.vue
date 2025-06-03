<script setup lang="ts">
import type { ImageMetadata } from 'astro'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{
  icon: ImageMetadata
  name: string
  description: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    :class="
      cn(
        'relative -mx-[calc(1em*2/18)] inline-block h-[calc(1em*30/18)] w-[calc(1em*30/18)]',
        `action-${props.name}`,
        props.class
      )
    "
  >
    <div class="relative inline-block w-full">
      <slot>
        <img :src="icon.src" :alt="description" />
      </slot>
    </div>
  </span>
</template>
