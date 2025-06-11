<script setup lang="ts">
import { motion } from 'motion-v'
import { ref } from 'vue'

defineProps<{
  navList: {
    label: string
    id: string
  }[]
}>()

const baseNavItemStyle = 'relative py-1.5 px-2 rounded-md transition-colors duration-300 text-sm flex items-center'
const activeNavItemStyle = 'bg-primary/10 text-primary font-medium'
const hoverNavItemStyle = 'hover:bg-muted/50'

const currentUrl = ref(location.href)

const handleUrlChange = async (id: string) => {
  location.hash = id
  currentUrl.value = location.href
}
</script>

<template>
  <aside
    class="bg-card text-card-foreground sticky top-[calc(5rem+1px)] mx-4 space-y-4 self-start rounded-lg border p-4 shadow-md"
  >
    <nav class="space-y-2">
      <h2 class="text-md font-semibold">
        导航
      </h2>
      <ul class="space-y-1">
        <motion.li
          v-for="nav in navList"
          :key="nav.id"
          :while-hover="{ x: 2 }"
          :transition="{ type: 'tween', duration: 0.2 }"
          @click="handleUrlChange(nav.id)"
        >
          <a
            :href="`#${nav.id}`"
            :class="`${baseNavItemStyle} ${hoverNavItemStyle} ${currentUrl.includes(`#${nav.id}`) ? activeNavItemStyle : ''}`"
          >
            <span v-if="currentUrl.includes(`#${nav.id}`)" class="bg-primary absolute left-0 h-4 w-1 rounded-full" />
            <span class="ml-1">{{ nav.label }}</span>
          </a>
        </motion.li>
      </ul>
    </nav>
  </aside>
</template>
