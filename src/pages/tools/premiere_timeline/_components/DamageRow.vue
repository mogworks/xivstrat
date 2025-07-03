<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { AnimatePresence, LayoutGroup, motion } from 'motion-v'
import { computed } from 'vue'

import { cn, timeToSeconds } from '@/lib/utils'

import type { DamageInfoData } from '../damage'

import { $timer, getStopTimer } from '../_stores/timer'
import Damage from './Damage.vue'

interface Props {
  damages: DamageInfoData[]
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})

const timer = useStore($timer)

// 计算显示的 damage 队列
const visibleDamages = computed(() => {
  const currentTime = timer.value / 1000
  const maxCount = 3 // 最多同时显示 maxCount 个

  const res = props.damages
    .map(damage => ({
      ...damage,
      timeInSeconds: timeToSeconds(damage.time),
      id: `${damage.name}-${damage.time}`, // 为了 key
    }))
    .filter((damage) => {
      const diff = damage.timeInSeconds - currentTime
      // 在 15.4 秒以内显示，1.4 秒后消失
      return diff <= 15.4 && diff >= -1.4
    })
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds) // 按时间排序
    .slice(0, maxCount)
  if (
    res.length > 0 &&
    res[res.length - 1].type === 'special' &&
    res[res.length - 1].value === '9999999' &&
    res[res.length - 1].timeInSeconds <= currentTime
  ) {
    getStopTimer()?.()
  }
  return res
})
</script>

<template>
  <LayoutGroup>
    <motion.div :class="cn('flex h-40 items-end gap-8', props.class)">
      <AnimatePresence mode="popLayout">
        <motion.div
          v-for="damage in visibleDamages"
          :key="damage.id"
          layout
          :initial="{
            opacity: 0,
            x: 120,
            scale: 0.85,
            rotateY: -15,
          }"
          :animate="{
            opacity: 1,
            x: 0,
            scale: 1,
            rotateY: 0,
          }"
          :exit="{
            opacity: 0,
            x: -120,
            scale: 0.85,
            rotateY: 15,
            filter: 'blur(4px)',
          }"
          :transition="{
            layout: {
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
            x: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
            rotateY: { duration: 0.5 },
            filter: { duration: 0.3 },
          }"
          style="perspective: 1000px"
        >
          <Damage :damage-info="damage" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  </LayoutGroup>
</template>
