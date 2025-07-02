<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef } from 'vue'

import type { Duty } from '@/data/duty'

import LogSVG from '@/assets/svg/log.svg?component'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-vue/dialog'
import { Separator } from '@/components/shadcn-vue/separator'
import { cn } from '@/lib/utils'

interface LogContent {
  text: string
  isSignificant?: boolean
  isNew?: boolean
}

interface Log {
  date: string
  content: LogContent[]
}

const props = defineProps<{
  duty: Duty
  logs: Log[]
}>()

const tagBaseClass =
  'min-w-fit inline-flex self-start items-center rounded-full border p-0.25 px-2 text-base text-[calc(1em*14/18)] text-white font-bold align-middle'

const isOpen = defineModel<boolean>({ default: false })
const buttonRef = useTemplateRef<HTMLButtonElement>('button')

const sortedLogs = computed(() => {
  const sortedLogs = [...props.logs]

  sortedLogs.sort((a, b) => {
    return b.date.localeCompare(a.date)
  })

  return sortedLogs
})

const handleOpen = (e?: MouseEvent) => {
  e?.stopPropagation()
  e?.preventDefault()
  isOpen.value = true
}

const handleUnderstood = () => {
  try {
    const latestLogDate = sortedLogs.value[0]?.date
    const dutyName = props.duty.name.replaceAll(' ', '_').trim()
    if (!latestLogDate) {
      return
    }

    const logStatus = window.localStorage.getItem('log-status')
    const parsedLogStatus: Record<string, string> = JSON.parse(logStatus ?? '{}')
    parsedLogStatus[dutyName] = latestLogDate

    const newLogStatus = JSON.stringify(parsedLogStatus)
    window.localStorage.setItem('log-status', newLogStatus)
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  try {
    await nextTick()
    const latestLogDate = sortedLogs.value[0]?.date
    const dutyName = props.duty.name.replaceAll(' ', '_').trim()
    if (!latestLogDate) {
      return
    }

    const logStatus = window.localStorage.getItem('log-status')
    const parsedLogStatus: Record<string, string> = JSON.parse(logStatus ?? '{}')
    const currentDutyLogStatus = parsedLogStatus?.[dutyName]
    if (!currentDutyLogStatus || currentDutyLogStatus !== latestLogDate) {
      return handleOpen()
    }
  } catch (error) {
    console.error(error)
    return handleOpen()
  }
})
</script>

<template>
  <Dialog v-if="logs && logs.length > 0" v-model:open="isOpen">
    <DialogTrigger>
      <button
        class="flex w-max cursor-pointer items-center justify-between rounded-lg border border-zinc-400/80 bg-transparent p-2 px-4 align-middle hover:opacity-60"
        @click="handleOpen"
      >
        <LogSVG class="mr-2 h-5 w-5" />
        更新日志
      </button>
    </DialogTrigger>
    <DialogContent
      class="w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]"
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
          <p id="update-log-title" class="flex h-5 items-center gap-2">
            <span>更新日志</span>
            <Separator orientation="vertical" class="h-full" />
            <span class="hidden font-[400] lg:inline-flex">{{ duty.name }}</span>
            <span class="inline-flex font-[400] lg:hidden">{{ duty.short }}</span>
          </p>
        </DialogTitle>
      </DialogHeader>
      <template v-if="$slots.default">
        <slot v-bind="sortedLogs" />
      </template>
      <template v-else>
        <ol class="flex h-128 flex-col gap-4 overflow-auto pb-4">
          <li
            v-for="(log, logIndex) in sortedLogs"
            :key="log.date"
            class="min-h-fit overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800 dark:hover:shadow-gray-700"
          >
            <div
              class="flex items-center gap-2 rounded-t-2xl border border-purple-100 bg-purple-50 px-4 py-2 dark:border-purple-900 dark:bg-purple-900/30"
            >
              <span class="font-medium text-purple-600 dark:text-purple-300"> {{ log.date }}</span>
              <template v-if="logIndex === 0">
                <span class="mb-0.5 font-medium text-purple-600 dark:text-purple-300"> / </span>
                <span class="font-medium text-purple-600 dark:text-purple-300">最新</span>
              </template>
            </div>
            <ol class="border border-t-0 p-4 dark:border-gray-700">
              <template v-if="log.content && log.content.length >= 1">
                <li
                  v-for="(content, index) in log.content"
                  :key="content.text"
                  class="flex items-center gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200"
                >
                  <span class="self-start font-extrabold italic">{{ index + 1 }}.</span>
                  <span>{{ content.text }}</span>
                  <span v-if="content.isNew" :class="cn(tagBaseClass, 'border-emerald-200/75 bg-emerald-600/90')">
                    新功能
                  </span>
                  <span v-if="content.isSignificant" :class="cn(tagBaseClass, 'border-red-200/75 bg-red-700/90')">
                    重要改动
                  </span>
                </li>
              </template>
              <template v-else>
                <p class="text-sm leading-relaxed text-gray-700/50 dark:text-gray-200/50">
                  暂无更新日志
                </p>
              </template>
            </ol>
          </li>
        </ol>
      </template>
      <DialogClose
        ref="button"
        data-close-button
        class="mr-auto w-full cursor-pointer rounded-lg border border-purple-400 bg-purple-500 p-2 px-6 align-middle text-base text-white hover:bg-purple-700/60 dark:border-purple-500 dark:bg-purple-700/75"
        @click="handleUnderstood"
      >
        了解
      </DialogClose>
    </DialogContent>
  </Dialog>
</template>
