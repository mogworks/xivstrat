<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import type { VariantType } from '@/lib/variant'

import { cn } from '@/lib/utils'

const props = defineProps<{
  variant?: VariantType
  class?: HTMLAttributes['class']
}>()

const style = {
  default: 'text-foreground [text-shadow:_0_0_1px_var(--color-background)]',
  red: 'text-red-600 [text-shadow:_0_0_1px_var(--color-red-600)] dark:text-red-400',
  orange: 'text-orange-600 [text-shadow:_0_0_1px_var(--color-orange-600)] dark:text-orange-400',
  amber: 'text-amber-600 [text-shadow:_0_0_1px_var(--color-amber-600)] dark:text-amber-400',
  yellow: 'text-yellow-600 [text-shadow:_0_0_1px_var(--color-yellow-600)] dark:text-yellow-400',
  lime: 'text-lime-600 [text-shadow:_0_0_1px_var(--color-lime-600)] dark:text-lime-400',
  green: 'text-green-600 [text-shadow:_0_0_1px_var(--color-green-600)] dark:text-green-400',
  emerald: 'text-emerald-600 [text-shadow:_0_0_1px_var(--color-emerald-600)] dark:text-emerald-400',
  teal: 'text-teal-600 [text-shadow:_0_0_1px_var(--color-teal-600)] dark:text-teal-400',
  cyan: 'text-cyan-600 [text-shadow:_0_0_1px_var(--color-cyan-600)] dark:text-cyan-400',
  sky: 'text-sky-600 [text-shadow:_0_0_1px_var(--color-sky-600)] dark:text-sky-400',
  blue: 'text-blue-600 [text-shadow:_0_0_1px_var(--color-blue-600)] dark:text-blue-400',
  indigo: 'text-indigo-600 [text-shadow:_0_0_1px_var(--color-indigo-600)] dark:text-indigo-400',
  violet: 'text-violet-600 [text-shadow:_0_0_1px_var(--color-violet-600)] dark:text-violet-400',
  purple: 'text-purple-600 [text-shadow:_0_0_1px_var(--color-purple-600)] dark:text-purple-400',
  fuchsia: 'text-fuchsia-600 [text-shadow:_0_0_1px_var(--color-fuchsia-600)] dark:text-fuchsia-400',
  pink: 'text-pink-600 [text-shadow:_0_0_1px_var(--color-pink-600)] dark:text-pink-400',
  rose: 'text-rose-600 [text-shadow:_0_0_1px_var(--color-rose-600)] dark:text-rose-400',
  slate: 'text-slate-600 [text-shadow:_0_0_1px_var(--color-slate-600)] dark:text-slate-400',
  gray: 'text-gray-600 [text-shadow:_0_0_1px_var(--color-gray-600)] dark:text-gray-400',
  zinc: 'text-zinc-600 [text-shadow:_0_0_1px_var(--color-zinc-600)] dark:text-zinc-400',
  neutral: 'text-neutral-600 [text-shadow:_0_0_1px_var(--color-neutral-600)] dark:text-neutral-400',
  stone: 'text-stone-600 [text-shadow:_0_0_1px_var(--color-stone-600)] dark:text-stone-400',
}[props.variant ?? 'default']
</script>

<template>
  <span :class="cn(style, props.class)">
    <slot />
  </span>
</template>
