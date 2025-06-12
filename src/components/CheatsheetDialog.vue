<script setup lang="ts">
import ScannerSVG from '@/assets/svg/scanner.svg?component'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-vue/dialog'

defineProps<{
  title?: string
  description?: string
  src?: string
}>()
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <button
        class="flex w-max min-w-33 cursor-pointer items-center justify-between rounded-lg border border-purple-400 bg-purple-500 p-2 px-4 align-middle text-white hover:bg-purple-700/60 dark:border-purple-500 dark:bg-purple-700/75"
      >
        <ScannerSVG />
        小抄速览
      </button>
    </DialogTrigger>
    <DialogContent class="w-[80%]">
      <DialogHeader>
        <DialogTitle v-if="$slots.title || title">
          <slot name="title">
            {{ title }}
          </slot>
        </DialogTitle>
        <DialogDescription v-if="$slots.description">
          <slot name="description">
            {{ description }}
          </slot>
        </DialogDescription>
      </DialogHeader>
      <slot>
        <img :src="src" loading="lazy" alt="副本小抄" class="w-full">
      </slot>
      <DialogFooter v-if="$slots.footer">
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
