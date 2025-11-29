<script setup lang="ts">
import type { ImageMetadata } from 'astro'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{
  icon: ImageMetadata
  name: string
  description: string
  tag?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    :class="cn('relative -mx-[calc(1em*2/18)] inline-block h-[calc(1em*27/18)] w-[calc(1em*27/18)]', props.class)"
    data-icon="buff-icon"
  >
    <div class="relative inline-block w-full translate-y-[-12.5%] align-middle">
      <slot>
        <img :src="icon.src" :alt="description">
      </slot>
    </div>
    <span
      v-if="tag"
      class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3/5 text-[calc(1em*12/18)] whitespace-nowrap text-white [text-shadow:0_0_2px_black,0_0_2px_black,0_0_2px_black,0_0_3px_black,0_0_3px_black,0_0_3px_black]"
      data-icon="buff-icon"
    >
      {{ tag }}
    </span>
  </span>
</template>
