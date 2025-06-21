<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'

import MagnifierCursorSVGRaw from '@/assets/svg/magnifier-cursor.svg?raw'
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

const isOpen = ref(false)

const scale = ref(1)
const translateOrigin = ref({
  x: 0,
  y: 0,
})
const dragPosition = ref({
  x: 0,
  y: 0,
})
const imageContentRef = useTemplateRef<HTMLDivElement>('imageContent')
const isDragging = ref(false)

const handleScroll = (event: WheelEvent) => {
  if (event.shiftKey || !imageContentRef.value) {
    return
  }
  event.preventDefault()
  const rect = imageContentRef.value.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top
  const imgX = mouseX / scale.value
  const imgY = mouseY / scale.value
  const oldScale = scale.value
  const delta = -event.deltaY
  const newScale = Math.min(Math.max(scale.value + delta * 0.001, 0.1), 3)
  if (newScale < 0.01 || newScale > 3) {
    return
  }
  scale.value = newScale
  translateOrigin.value = {
    x: (translateOrigin.value.x -= imgX * (newScale - oldScale)),
    y: (translateOrigin.value.y -= imgY * (newScale - oldScale)),
  }
}

const handleReset = () => {
  scale.value = 1
  translateOrigin.value = {
    x: 0,
    y: 0,
  }
  dragPosition.value = { x: 0, y: 0 }
  isDragging.value = false
}

const startDrag = (e: MouseEvent) => {
  e.preventDefault()
  // 只响应左键及中键
  if (e.button !== 0 && e.button !== 1) {
    return
  }

  isDragging.value = true
  dragPosition.value = {
    x: e.clientX - translateOrigin.value.x,
    y: e.clientY - translateOrigin.value.y,
  }
}

const onDrag = (e: MouseEvent) => {
  e.preventDefault()
  if (!isDragging.value) {
    return
  }

  translateOrigin.value = {
    x: e.clientX - dragPosition.value.x,
    y: e.clientY - dragPosition.value.y,
  }
}

const stopDrag = (e: MouseEvent) => {
  e.preventDefault()
  if (!isDragging.value) {
    return
  }

  isDragging.value = false
}

watch(
  () => isOpen.value,
  (open) => {
    if (open) {
      handleReset()
    }
  }
)
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <div
        class="group relative"
        :style="{
          cursor: `url('data:image/svg+xml;utf8,${encodeURIComponent(MagnifierCursorSVGRaw)}') 16 16, pointer`,
        }"
      >
        <slot />
      </div>
    </DialogTrigger>
    <DialogContent class="w-[80%]">
      <DialogHeader>
        <DialogTitle>
          <slot name="title">
            {{ title }}
          </slot>
          <div v-if="useScale" class="inline-flex h-20 items-center gap-4">
            <input
              v-model.number="scale"
              type="range"
              min="0.1"
              max="3"
              step="0.01"
              class="slider inline-flex h-2 max-w-50 flex-grow-1 appearance-none rounded-[4px] bg-[#e0e0e0] outline-none"
            >
            <div class="inline-flex min-w-[100px] text-center font-bold">
              缩放比例: {{ Math.round(scale * 100) }}%
            </div>
            <div v-if="scale !== 1 || translateOrigin.x || translateOrigin.y">
              <button
                class="flex w-max cursor-pointer items-center justify-between gap-1 rounded-sm border border-purple-400 bg-purple-500 p-1 px-2 align-middle text-xs text-white hover:bg-purple-700/60 dark:border-purple-500 dark:bg-purple-700/75"
                @click="handleReset"
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
          ref="imageContent"
          class="flex h-full w-full max-w-[80vw] flex-row gap-4 will-change-transform select-none"
          :style="{
            cursor: isDragging ? 'grabbing' : 'grab',
            transform: `translate3d(${translateOrigin.x}px, ${translateOrigin.y}px, 0) scale(${scale})`,
            transformOrigin: 'top left',
          }"
          @mousewheel="handleScroll"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
        >
          <slot>
            <img v-if="src" :src="src" loading="lazy" alt="图片" class="block h-full object-contain object-left-top">
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
  border: none;
  /* 移除Firefox默认边框 */
}
</style>
