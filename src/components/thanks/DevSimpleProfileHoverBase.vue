<script setup lang="ts">
import { computed } from 'vue'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/shadcn-vue/hover-card'

const props = withDefaults(
  defineProps<{
    userId: string
    name: string
    link?: string
    gameName?: string
  }>(),
  {
    link: '#',
  }
)

const breakNames = computed(() => {
  return props.name?.split('/').map(item => item?.trim())
})

const specialAlignAvatarClass = computed(() => {
  if (props.userId === 'superjump') {
    // 尺寸微调
    return 'h-17 w-17 translate-y-1.5'
  }
  return 'h-14 w-14'
})

const specialAlignDetailAvatarClass = computed(() => {
  if (props.userId === 'superjump') {
    // 尺寸微调
    return 'h-24 w-24'
  }
  return 'h-20 w-20'
})
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <a
        :href="link"
        target="_blank"
        class="inline-flex w-fit cursor-pointer flex-col items-center gap-0.5 transition-all duration-150 hover:scale-105"
      >
        <div :class="`flex ${specialAlignAvatarClass} mr-1 items-center justify-center overflow-hidden rounded-full`">
          <slot />
        </div>

        <div
          v-if="breakNames"
          class="flex min-h-6 scale-80 flex-col items-center justify-center text-center text-xs leading-3 font-medium text-gray-400 dark:text-white/90"
        >
          <template v-for="item in breakNames" :key="item">
            <p>
              {{ item }}
            </p>
          </template>
        </div>
      </a>
    </HoverCardTrigger>
    <HoverCardContent class="w-auto max-w-150">
      <div class="flex items-center gap-2">
        <div
          :class="`${specialAlignDetailAvatarClass} mr-1 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full`"
        >
          <slot />
        </div>
        <div>
          <h2 class="text-xl font-bold">
            {{ name }}
          </h2>
          <h3 v-if="gameName" class="opacity-80">
            {{ gameName }}
          </h3>
        </div>
      </div>
      <template v-if="link">
        <hr class="m-2">
        <a :href="link" target="_blank" class="cursor-pointer opacity-80 hover:underline">
          {{ link }}
        </a>
      </template>
    </HoverCardContent>
  </HoverCard>
</template>
