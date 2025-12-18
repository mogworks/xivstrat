<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@xivstrat/shadcn-vue'
import { computed } from 'vue'
import { isValidURL } from '@/lib/utils'
import BiliBiliSVG from '@/svg/bilibili.svg?component'
import GitHubSVG from '@/svg/github.svg?component'
import LinkSVG from '@/svg/link.svg?component'

defineProps<{
  userId: string
  name: string
  link: string
  description?: string
}>()

const hostname = computed(() => location.hostname)
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <a
        :href="link"
        target="_blank"
        class="inline-flex w-fit min-w-17 cursor-pointer flex-col items-center gap-0.5 transition-all duration-150 hover:scale-105"
      >
        <div class="mr-1 flex items-center justify-center overflow-hidden">
          <slot />
        </div>
      </a>
    </HoverCardTrigger>
    <HoverCardContent class="w-auto max-w-300">
      <div class="flex items-center gap-2">
        <div class="mr-1 flex h-20 items-center justify-center overflow-hidden">
          <slot />
        </div>
        <div>
          <h2 class="text-xl font-bold">
            {{ name }}
          </h2>
          <h3 v-if="description" class="opacity-80">
            {{ description }}
          </h3>
        </div>
      </div>

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
          {{ link.startsWith('/') ? link.replace('/', `${hostname}/`) : link.replace(/^https?:\/\//, '') }}
        </span>
      </a>
    </HoverCardContent>
  </HoverCard>
</template>
