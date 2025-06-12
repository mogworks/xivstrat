<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  progress: number // 0-100
  variant?: 'red' | 'yellow' | 'green'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  variant: 'green',
  class: '',
})

const variantStyles = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
}
</script>

<template>
  <div :class="cn('relative h-3 w-full overflow-hidden rounded-full', props.class)">
    <div class="absolute inset-0 rounded-full bg-gray-700" />
    <div
      class="absolute inset-0 origin-left rounded-full transition-transform duration-300 ease-out"
      :class="variantStyles[props.variant]"
      :style="{ transform: `scaleX(${progress / 100})` }"
    />
  </div>
</template>
