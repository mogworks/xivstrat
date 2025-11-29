<script setup lang="ts">
import { computed } from 'vue'

import BiliBiliSVG from '@/svg/bilibili.svg?component'
import GitHubSVG from '@/svg/github.svg?component'
import LinkSVG from '@/svg/link.svg?component'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/shadcn-vue/hover-card'
import { isValidURL } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    userId: string
    name: string
    link?: string
    gameName?: string
    breakNames?: string[]
  }>(),
  {
    link: '#',
  },
)

const displayNames = computed(() => {
  if (props.breakNames?.length) {
    return props.breakNames
  }
  if (props.name) {
    return [props.name]
  }
  return void 0
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
        class="inline-flex w-fit min-w-17 cursor-pointer flex-col items-center gap-0.5 transition-all duration-150 hover:scale-105"
      >
        <div :class="`flex ${specialAlignAvatarClass} mr-1 items-center justify-center overflow-hidden rounded-full`">
          <slot />
        </div>

        <div
          v-if="displayNames && displayNames.length > 0"
          class="flex min-h-6 scale-80 flex-col items-center justify-center text-center text-xs leading-3 font-medium text-gray-400 dark:text-white/90"
        >
          <template v-for="item in displayNames" :key="item">
            <p class="w-17 break-all">
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
        <hr class="mt-4">
        <a
          :href="isValidURL(link) ? link : '#'"
          target="_blank"
          class="mt-4 inline-block max-w-full truncate rounded-full bg-cyan-50 px-4 py-1.5 text-sm text-cyan-600 transition-all duration-300 hover:bg-cyan-100 hover:underline dark:bg-cyan-900/20 dark:text-cyan-400 dark:hover:bg-cyan-900/30"
        >
          <span class="flex items-center gap-1">
            <template v-if="link.includes('bilibili')">
              <BiliBiliSVG />
            </template>
            <template v-else-if="link.includes('github')">
              <GitHubSVG />
            </template>
            <template v-else>
              <LinkSVG class="h-6 w-6" />
            </template>
            {{ link.replace(/^https?:\/\//, '') }}
          </span>
        </a>
      </template>
    </HoverCardContent>
  </HoverCard>
</template>
