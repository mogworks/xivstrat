<script lang="ts" setup>
import CloseSVG from '@/svg/close.svg?component'
import MenuSVG from '@/svg/menu.svg?component'
import NavItem from './NavItem.vue'
import type { Route } from './type'

const props = defineProps<{
  routes?: Route[]
}>()

const isOpen = defineModel<boolean>({ default: false })

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="fixed bottom-24 left-12 z-50 max-sm:hidden">
    <!-- Floating Button ovo -->
    <button
      aria-label="Toggle navigation menu"
      class="bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground fixed bottom-24 left-12 z-50 flex cursor-pointer items-center rounded-full border p-2 shadow-md transition-colors"
      @click="toggleMenu"
    >
      <component :is="!isOpen ? MenuSVG : CloseSVG" class="h-6 w-6" />
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
        class="fixed bottom-35 left-23 z-50 max-h-115 w-64 overflow-hidden overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-zinc-700"
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
