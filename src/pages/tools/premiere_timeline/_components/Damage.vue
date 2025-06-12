<script setup lang="ts">
import { cn } from '@/lib/utils'

import DamageInfo from './DamageInfo.vue'
import ProgressBar from './ProgressBar.vue'

interface Props {
  countdown: string | number
  skillName: string
  progress: number // 0-100
  damage: string
  damageType: 'physical' | 'magical' | 'special'
  mitigation: number
  variant?: 'red' | 'yellow' | 'green'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'green',
  class: '',
})
</script>

<template>
  <div :class="cn('flex w-75 flex-col gap-2', props.class)">
    <!-- 第一行：倒计时 + 技能名 -->
    <div class="flex items-end justify-between gap-8">
      <span class="text-3xl font-bold">
        {{ countdown }}
      </span>
      <span class="text-right text-3xl font-medium">
        {{ skillName }}
      </span>
    </div>

    <!-- 第二行：进度条 -->
    <ProgressBar :progress="progress" :variant="variant" />

    <!-- 第三行：减伤百分比 + 伤害信息 -->
    <div class="mt-1 flex items-center justify-between gap-8">
      <span class="mitigation text-3xl font-bold text-rose-400">{{ mitigation }}%↓</span>
      <div class="flex-shrink-0">
        <DamageInfo :damage="damage" :type="damageType" />
      </div>
    </div>
  </div>
</template>
