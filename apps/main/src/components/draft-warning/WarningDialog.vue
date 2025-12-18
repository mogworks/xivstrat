<script setup lang="ts">
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@xivstrat/shadcn-vue'
import { computed, onMounted, useTemplateRef } from 'vue'

const buttonRef = useTemplateRef<HTMLButtonElement>('button')
const isDev = computed(() => import.meta.env.MODE === 'development')
const isOpen = defineModel<boolean>({ default: true })

onMounted(() => {
  isDev.value && (isOpen.value = false)
})
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent
      class="w-[80%]"
      @interact-outside="
        (event) => {
          const target = event.target as HTMLElement
          if (target !== buttonRef) return event.preventDefault()
        }
      "
      @escape-key-down="(e) => e.preventDefault()"
      @close-auto-focus="(e) => e.preventDefault()"
      @focus-outside="(e) => e.preventDefault()"
    >
      <DialogHeader>
        <DialogTitle>
          <p class="text-5xl font-extrabold text-red-600">
            温馨提示 ⚠️
          </p>
        </DialogTitle>
      </DialogHeader>
      <slot />
      <DialogFooter />
      <DialogClose
        ref="button"
        data-close-button
        class="w-full cursor-pointer rounded-lg border border-purple-400 bg-purple-500 p-4 px-8 align-middle text-2xl text-white hover:bg-purple-700/60 dark:border-purple-500 dark:bg-purple-700/75"
      >
        我已明确知晓，点击此处/右上关闭
      </DialogClose>
    </DialogContent>
  </Dialog>
</template>
