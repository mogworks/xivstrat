<script setup lang="ts">
import { motion } from 'motion-v'

import SettingSVG from '@/assets/svg/setting.svg?component'
</script>

<template>
  <motion.button
    class="bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground fixed bottom-12 left-12 flex cursor-pointer items-center rounded-full border p-2 shadow-md transition-colors"
    while-hover="hover"
  >
    <span class="flex h-6 w-6 items-center justify-center">
      <SettingSVG />
    </span>
    <motion.span
      class="w-0 overflow-hidden text-nowrap text-clip opacity-0"
      :variants="{
        hover: {
          width: 'auto',
          marginRight: 'calc(var(--spacing) * 1.5)',
          opacity: 1,
        },
      }"
    >
      页面设置
    </motion.span>
  </motion.button>
</template>
