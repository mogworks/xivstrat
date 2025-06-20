<script setup lang="ts">
import { ref } from 'vue'

import NavItem from './NavItem.vue'

interface Route {
  name: string
  path?: string
  children?: Route[]
}

const props = defineProps<{
  routes?: Route[]
}>()

const emit = defineEmits(['menuToggle'])

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  emit('menuToggle', isOpen.value)
}
</script>

<template>
  <div class="fixed bottom-24 left-12 z-50">
    <!-- Floating Button ovo -->
    <button
      aria-label="Toggle navigation menu"
      class="bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground fixed bottom-24 left-12 flex cursor-pointer items-center rounded-full border p-2 shadow-md transition-colors"
      @click="toggleMenu"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
        <path
          v-if="!isOpen"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
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
      <div v-show="isOpen" class="fixed inset-0 z-40 bg-transparent" @click.self="toggleMenu" />
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
        class="fixed bottom-36 left-24 z-50 w-64 overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-700"
      >
        <ul class="divide-y divide-gray-200 dark:divide-gray-500">
          <NavItem
            v-for="(route, index) in props.routes"
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
