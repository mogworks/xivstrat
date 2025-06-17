<script setup lang="ts">
import { ref } from 'vue'

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

withDefaults(
  defineProps<{
    title?: string
    description?: string
    src?: string
    useScale?: boolean
  }>(),
  {
    useScale: true,
  }
)

const scale = ref(1)
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
        <DialogTitle>
          <slot name="title">
            {{ title }}
          </slot>
          <div v-if="useScale" class="flex items-center gap-4">
            <input
              v-model="scale"
              type="range"
              min="0.1"
              max="3"
              step="0.01"
              class="slider inline-flex h-2 max-w-50 flex-grow-1 appearance-none rounded-[4px] bg-[#e0e0e0] outline-none"
            >
            <div class="inline-flex min-w-[100px] text-center font-bold">
              缩放比例: {{ Math.round(scale * 100) }}%
            </div>
            <div v-if="scale !== 1">
              <button
                class="flex w-max cursor-pointer items-center justify-between gap-1 rounded-sm border border-purple-400 bg-purple-500 p-1 px-2 align-middle text-xs text-white hover:bg-purple-700/60 dark:border-purple-500 dark:bg-purple-700/75"
                @click="scale = 1"
              >
                重置
              </button>
            </div>
          </div>
        </DialogTitle>
        <DialogDescription v-if="$slots.description">
          <slot name="description">
            {{ description }}
          </slot>
        </DialogDescription>
      </DialogHeader>
      <div class="h-[75vh] overflow-auto">
        <div
          class="flex h-full w-full max-w-[80vw] flex-row gap-4 transition-all duration-150"
          :style="{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }"
        >
          <slot>
            <img
              v-if="src"
              :src="src"
              loading="lazy"
              alt="副本小抄"
              class="block h-full object-contain object-left-top"
            >
          </slot>
        </div>
      </div>
      <DialogFooter v-if="$slots.footer">
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
/* Webkit（Chrome, Safari, Edge） thumb */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #42b883;
  border-radius: 50%;
  cursor: pointer;
}

/* Firefox thumb */
.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #42b883;
  border-radius: 50%;
  cursor: pointer;
  border: none; /* 移除Firefox默认边框 */
}
</style>
