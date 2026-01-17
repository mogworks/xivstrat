<script setup lang="ts">
import { motion } from 'motion-v'
import { computed, onMounted, onUnmounted } from 'vue'
import { Separator } from '@/components/shadcn-vue'
import type { DutyMechanic, DutyPhase } from '@/data/duty'
import { useAnchorObserver } from '@/hooks/anchor'

const props = defineProps<{
  currentUrl: string
  phases: DutyPhase[]
}>()

const mechanics = computed(() => {
  const result: DutyMechanic[] = []
  props.phases.forEach((phase) => {
    const isActive = props.currentUrl === phase.href || props.currentUrl === `${phase.href}/`
    if (isActive) {
      result.push(...phase.mechanics)
    }
  })
  return result
})

const baseNavItemStyle = 'relative py-1.5 px-2 rounded-md transition-colors duration-300 text-sm flex items-center'
const activeNavItemStyle = 'bg-primary/10 text-primary font-medium'
const hoverNavItemStyle = 'hover:bg-muted/50'

const {
  click: handleNavClick,
  activate: handleActivateAnchorObserver,
  deactivate: handleDeactivateAnchorObserver,
  activeId,
} = useAnchorObserver(mechanics.value.map((item) => item.href?.slice(1)))

onMounted(async () => {
  await handleActivateAnchorObserver()
})

onUnmounted(() => {
  handleDeactivateAnchorObserver()
})
</script>

<template>
  <aside
    class="bg-card text-card-foreground sticky top-[calc(5rem+1px)] mx-4 space-y-4 self-start rounded-lg border p-4 shadow-md"
  >
    <!-- 阶段跳转 -->
    <nav class="space-y-2">
      <h2 class="text-md font-semibold">
        阶段跳转
      </h2>
      <ul class="space-y-1">
        <motion.li
          v-for="phase in phases"
          :key="phase.href"
          :while-hover="{ x: 2 }"
          :transition="{ type: 'tween', duration: 0.2 }"
        >
          <a
            :href="phase.href"
            :class="`${baseNavItemStyle} ${hoverNavItemStyle} ${currentUrl === phase.href || currentUrl === `${phase.href}/` ? activeNavItemStyle : ''}`"
          >
            <span
              v-if="currentUrl === phase.href || currentUrl === `${phase.href}/`"
              class="bg-primary absolute left-0 h-4 w-1 rounded-full"
            />
            <span class="ml-1">{{ phase.name }}</span>
          </a>
        </motion.li>
      </ul>
    </nav>
    <Separator />
    <!-- 机制跳转 -->
    <nav class="space-y-2">
      <h2 class="text-md font-semibold">
        机制跳转
      </h2>
      <ul class="space-y-1">
        <template v-if="mechanics.length > 0">
          <motion.li
            v-for="item in mechanics"
            :key="item.href"
            :while-hover="{ x: 2 }"
            :transition="{ type: 'tween', duration: 0.2 }"
            @click.prevent="handleNavClick(item.href.slice(1))"
          >
            <a
              :href="item.href"
              :class="`${baseNavItemStyle} ${hoverNavItemStyle} ${activeId === item.href?.slice(1) ? activeNavItemStyle : ''}`"
            >
              <span v-if="activeId === item.href?.slice(1)" class="bg-primary absolute left-0 h-4 w-1 rounded-full" />
              <span class="ml-1">{{ item.name }}</span>
            </a>
          </motion.li>
        </template>
        <li v-else class="text-muted-foreground text-sm">
          待更新
        </li>
      </ul>
    </nav>
  </aside>
</template>
