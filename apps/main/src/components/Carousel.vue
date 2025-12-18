<script setup lang="ts">
import { watchOnce } from '@vueuse/core'
import type { CarouselApi } from '@xivstrat/shadcn-vue'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@xivstrat/shadcn-vue'
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'

const props = defineProps<{
  slots: Slot[]
  loop?: boolean
  class?: HTMLAttributes['class']
}>()
const api = ref<CarouselApi>()
const totalCount = ref(0)
const current = ref(0)

function setApi(val: CarouselApi) {
  api.value = val
}

watchOnce(api, (api) => {
  if (!api) {
    return
  }

  totalCount.value = api.scrollSnapList().length
  current.value = api.selectedScrollSnap() + 1

  api.on('select', () => {
    current.value = api.selectedScrollSnap() + 1
  })
})
type Slot = string | number
</script>

<template>
  <Carousel
    :opts="{
      loop: props.loop,
    }"
    :class="props.class"
    @init-api="setApi"
  >
    <CarouselContent>
      <CarouselItem v-for="slot in props.slots" :key="slot">
        <slot :name="slot" />
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
