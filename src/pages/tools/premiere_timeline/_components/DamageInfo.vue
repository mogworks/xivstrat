<script setup lang="ts">
import { computed } from 'vue'

import magicalImg from '@/assets/damage_type/magical.png'
import physicalImg from '@/assets/damage_type/physical.png'
import specialImg from '@/assets/damage_type/special.png'
import { cn } from '@/lib/utils'

interface Props {
  damage: string
  type: 'physical' | 'magical' | 'special'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})

const styles = {
  physical: 'border-sky-600 from-sky-600/75 to-sky-950 dark:to-sky-600/0',
  magical: 'border-purple-600 from-purple-600/75 to-purple-950 dark:to-purple-600/0',
  special: 'border-green-600 from-green-600/75 to-green-950 dark:to-green-600/0',
}

const images = {
  physical: physicalImg,
  magical: magicalImg,
  special: specialImg,
}

const style = computed(() => styles[props.type])
const img = computed(() => images[props.type])
</script>

<template>
  <span
    :class="cn('inline-flex items-center rounded border bg-gradient-to-r pr-2 text-3xl text-white', style, props.class)"
  >
    <img :src="img.src" :alt="type" class="ml-px h-[calc(1em*20/18)] w-[calc(1em*20/18)] scale-110">
    {{ damage }}
  </span>
</template>
