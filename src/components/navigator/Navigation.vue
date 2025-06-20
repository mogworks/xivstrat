<script setup>
import { ref } from 'vue'

import NavItem from './NavItem.vue'

// eslint-disable-next-line unused-imports/no-unused-vars
const props = defineProps({
  routes: {
    type: Array,
    required: false,
    default: () => []
  }
})

const emit = defineEmits(['menu-toggle'])

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('menu-toggle', isOpen.value)
}
</script>

<script>
export default {}
</script>

<template>
  <div class="fixed z-50 bottom-24 left-12">
    <!-- Floating Button ovo -->
    <button
      aria-label="Toggle navigation menu"
      class="bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground fixed bottom-24 left-12 flex cursor-pointer items-center rounded-full border p-2 shadow-md transition-colors"
      @click="toggleMenu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Overlay ovo -->
    <transition
      enter-active-class="transition-opacity duration-100 ease-linear"
      leave-active-class="transition-opacity duration-100 ease-linear"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-show="isOpen"
        class="fixed inset-0 bg-transparent z-40"
        @click.self="toggleMenu"
      />
    </transition>

    <!-- Menu ovo -->
    <transition
      enter-active-class="transition-all duration-100 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-from-class="opacity-0 translate-y-5"
      leave-to-class="opacity-0 translate-y-5"
    >
      <div
        v-show="isOpen"
        class="fixed bottom-36 left-24 w-64 bg-white dark:bg-zinc-700 rounded-lg shadow-xl overflow-hidden z-50"
      >
        <ul class="divide-y divide-gray-200 dark:divide-gray-500">
          <NavItem
            v-for="(route, index) in routes"
            :key="index"
            :name="route.name"
            :path="route.path"
            :children="route.children"
          />
        </ul>
      </div>
    </transition>
  </div>
</template>
