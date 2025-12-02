<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import RightArrowSVG from '@/svg/right-arrow.svg?component'

import type { Route } from './type'

const props = withDefaults(
  defineProps<{
    name: string
    path?: string
    children?: Route[]
    deepIndex?: number
  }>(),
  {
    path: undefined,
    children: () => [],
    deepIndex: 0,
  },
)

const expanded = ref(false)
const toggle = () => {
  if (props.children?.length) {
    expanded.value = !expanded.value
  }
}
const isCurrent = ref(false)
onMounted(() => {
  isCurrent.value =
    (props.path !== '/' && props.path && window.location.pathname.startsWith(props.path)) ||
    (props.path === '/' && window.location.pathname === props.path)
})
</script>

<template>
  <li>
    <div
      v-if="children.length"
      class="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-indigo-100 dark:hover:bg-indigo-900"
      @click="toggle"
    >
      <span class="pr-8 text-gray-800 dark:text-gray-200">{{ name }}</span>
      <RightArrowSVG class="rotate-90 overflow-visible transition-transform" :class="{ 'rotate-270': expanded }" />
    </div>

    <component
      :is="isCurrent ? 'span' : 'a'"
      v-else
      :href="isCurrent ? undefined : path"
      :class="
        isCurrent
          ? 'block cursor-default px-4 py-3 text-indigo-600 transition-colors dark:text-indigo-400'
          : 'block cursor-pointer px-4 py-3 text-gray-800 transition-colors hover:bg-indigo-100 dark:text-gray-200 dark:hover:bg-indigo-900'
      "
    >
      {{ name }}
    </component>
    <Transition
      enter-active-class="transition-all duration-100 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
    >
      <ul
        v-if="children.length && expanded"
        class="space-y-0 divide-y divide-gray-200 border-l-10 border-gray-500/40 dark:divide-gray-500 dark:border-gray-400"
      >
        <NavItem
          v-for="(child, index) in children"
          :key="index"
          :name="child.name"
          :path="child.path"
          :children="child.children"
          :deep-index="deepIndex + 1"
        />
      </ul>
    </Transition>
  </li>
</template>
