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
  bgColor?: string
  fgColor?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  bgColor: 'bg-gray-300 dark:bg-gray-700',
  fgColor: 'bg-blue-500',
  class: '',
})
</script>

<template>
  <div :class="cn('damage-container w-80 space-y-2', props.class)">
    <!-- 第一行：倒计时 + 技能名 -->
    <div class="flex items-center justify-between">
      <span class="countdown font-mono text-3xl font-bold">
        {{ countdown }}
      </span>
      <span class="skill-name text-3xl font-medium">
        {{ skillName }}
      </span>
    </div>

    <!-- 第二行：进度条 -->
    <div class="progress-row">
      <ProgressBar :progress="progress" :bg-color="bgColor" :fg-color="fgColor" height="h-3" />
    </div>

    <!-- 第三行：减伤百分比 + 伤害信息 -->
    <div class="flex items-center justify-between">
      <span class="mitigation text-3xl font-bold text-red-400"> {{ mitigation }}%↓ </span>
      <div class="flex-shrink-0">
        <DamageInfo :damage="damage" :type="damageType" />
      </div>
    </div>
  </div>
</template>
