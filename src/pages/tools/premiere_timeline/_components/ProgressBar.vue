<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  progress: number // 0-100
  bgColor?: string
  fgColor?: string
  height?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  bgColor: 'bg-gray-300 dark:bg-gray-700',
  fgColor: 'bg-blue-500',
  height: 'h-4',
  class: '',
})
</script>

<template>
  <div :class="cn('progress-bar-container relative w-full overflow-hidden rounded-full', props.height, props.class)">
    <!-- 背景 -->
    <div class="absolute inset-0 rounded-full" :class="bgColor" />

    <!-- 前景进度条 -->
    <div
      class="absolute inset-0 origin-left rounded-full transition-transform duration-300 ease-out"
      :class="fgColor"
      :style="{ transform: `scaleX(${progress / 100})` }"
    />
  </div>
</template>
