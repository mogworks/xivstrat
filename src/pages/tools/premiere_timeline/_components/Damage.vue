<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { computed } from 'vue'

import { cn, timeToSeconds } from '@/lib/utils'

import { $mitigation } from '../_stores/mitigation'
import { $timer } from '../_stores/timer'
import DamageInfo from './DamageInfo.vue'
import ProgressBar from './ProgressBar.vue'

interface Props {
  damageInfo: {
    name: string
    time: string
    type: 'physical' | 'magical' | 'special'
    value: string
  }
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})

const time = timeToSeconds(props.damageInfo.time)

const timer = useStore($timer)
const mitigation = useStore($mitigation)

const damageName = props.damageInfo.name
const damageType = props.damageInfo.type as 'physical' | 'magical' | 'special'
const damageValue = Number.parseInt(props.damageInfo.value)
const variant = damageValue > 160000 ? 'red' : damageValue > 80000 ? 'yellow' : 'green'
const diff = computed(() => {
  return time - timer.value / 1000
})
const diffStr = computed(() => {
  if (diff.value > 15) {
    return '15'
  }
  if (diff.value > 0) {
    return Math.ceil(diff.value).toString().padStart(2, '0')
  }
  return '00'
})
const progress = computed(() => {
  if (diff.value > 15) {
    return 100
  }
  if (diff.value > 0) {
    return (diff.value / 15) * 100
  }
  return 0
})
const mitigationStr = computed(() => {
  const v = 100 - mitigation.value[damageType] * 100
  return v === 0 ? '' : `${v.toFixed(1)}%↓`
})
const damageStr = computed(() => {
  const v = (damageValue * mitigation.value[damageType]) / 1000
  return `${Number.parseInt(v.toFixed(0)) * 1000}`
})
</script>

<template>
  <div :class="cn('flex w-75 flex-col gap-2', props.class)">
    <!-- 第一行：倒计时 + 技能名 -->
    <div class="flex items-end justify-between gap-8">
      <span class="text-3xl font-bold">
        {{ diffStr }}
      </span>
      <span class="text-right text-3xl font-medium">
        {{ damageName }}
      </span>
    </div>

    <!-- 第二行：进度条 -->
    <ProgressBar :progress="progress" :variant="variant" />

    <!-- 第三行：减伤百分比 + 伤害信息 -->
    <div class="mt-1 flex items-center justify-between gap-8">
      <span class="text-3xl font-bold text-rose-400">{{ mitigationStr }}</span>
      <DamageInfo :damage="damageStr" :type="damageType" />
    </div>
  </div>
</template>
