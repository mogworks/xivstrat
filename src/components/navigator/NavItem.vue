<script setup>
import { defineProps, onMounted, ref } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    default: null
  },
  children: {
    type: Array,
    default: () => []
  }
})

const expanded = ref(false)
const toggle = () => {
  if (props.children.length) {
    expanded.value = !expanded.value
  }
}
const isCurrent = ref(false)
onMounted(() => {
  isCurrent.value = (props.path !== '/' && window.location.pathname.startsWith(props.path)) || (props.path === '/' && window.location.pathname === props.path)
})
</script>

<template>
  <li>
    <div
      v-if="children.length"
      class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900"
      @click="toggle"
    >
      <span class="text-gray-800 dark:text-gray-200">{{ name }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': expanded }"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <component
      :is="isCurrent ? 'span' : 'a'"
      v-else
      :href="isCurrent ? undefined : path"
      :class="isCurrent ? 'block px-4 py-3 text-indigo-600 dark:text-indigo-400 transition-colors cursor-default' : 'block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer'"
    >
      {{ name }}
    </component>

    <ul
      v-if="children.length && expanded"
      class="pl-4 mt-1 space-y-1 border-l divide-y divide-gray-200 dark:divide-gray-500 dark:border-gray-500"
    >
      <NavItem
        v-for="(child, index) in children"
        :key="index"
        :name="child.name"
        :path="child.path"
        :children="child.children"
      />
    </ul>
  </li>
</template>
