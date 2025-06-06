<script setup lang="ts">
import { useStore } from '@nanostores/vue'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-vue/dialog'
import { Separator } from '@/components/shadcn-vue/separator'
import RadioGroup from '@/components/StratSettingsRadioGroup.vue'
import TriggerButton from '@/components/StratSettingsTriggerButton.vue'
import { $stratSettings } from '@/stores/stratSettings'

const stratSettings = useStore($stratSettings)

const viewModeSetting = {
  name: '视图模式',
  options: [
    {
      id: 'default',
      name: '默认',
      description: '正常显示所有信息',
    },
    {
      id: 'solution',
      name: '解法',
      description: '保留解法，隐藏机制、说明，适合快速查阅解法',
    },
    {
      id: 'timeline',
      name: '时间轴',
      description: '纯时间轴，隐藏机制、说明、解法等，适合快速查阅时间轴',
    },
    {
      id: 'damage',
      name: '仅伤害',
      description: '仅保留有伤害的事件，适合快速查阅伤害',
    },
  ],
  onChange: (value: string) => {
    $stratSettings.setKey('viewMode', value as 'default' | 'solution' | 'timeline' | 'damage')
  },
}

const readMode = {
  name: '阅读模式',
  options: [
    {
      id: 'standard',
      name: '标准模式',
      description: '显示全部图标',
    },
    {
      id: 'minimal',
      name: '简洁模式',
      description: '角色、BOSS等图标以文字显示',
    },
  ],
  onChange: (value: string) => {
    $stratSettings.setKey('readMode', value as 'standard' | 'minimal')
  },
}

const attackEventSetting = {
  name: '普通攻击',
  options: [
    {
      id: 'hide',
      name: '隐藏',
      description: '隐藏普通攻击',
    },
    {
      id: 'show',
      name: '显示',
      description: '显示普通攻击',
    },
    {
      id: 'only',
      name: '仅显示',
      description: '仅显示普通攻击',
    },
  ],
  onChange: (value: string) => {
    $stratSettings.setKey('attackEvent', value as 'hide' | 'show' | 'only')
  },
}

const timelineOriginSetting = {
  name: '时间轴起点',
  options: [
    {
      id: 'global',
      name: '全局',
      description: '以整场战斗起始点为准',
    },
    {
      id: 'phase',
      name: '阶段',
      description: '以当前阶段起始点为准',
    },
  ],
  onChange: (value: string) => {
    $stratSettings.setKey('timelineOrigin', value as 'global' | 'phase')
  },
}

const timeFormatSetting = {
  name: '时间格式',
  options: [
    {
      id: 'mm:ss',
      name: '分:秒',
      description: '如：13:46.3',
    },
    {
      id: 's',
      name: '秒',
      description: '如：826.3',
    },
  ],
  onChange: (value: string) => {
    $stratSettings.setKey('timeFormat', value as 'mm:ss' | 's')
  },
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <TriggerButton />
    </DialogTrigger>
    <DialogContent
      class="mx-auto flex w-[90vw] max-w-xs flex-col gap-0 p-0 sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl"
    >
      <DialogHeader class="contents space-y-0 text-left">
        <DialogTitle class="p-4 text-xl">
          页面设置
        </DialogTitle>
        <DialogDescription class="hidden" />
      </DialogHeader>
      <Separator />
      <div class="flex max-h-[65vh] flex-col gap-4 overflow-y-auto p-4">
        <RadioGroup
          :name="viewModeSetting.name"
          :default-value="stratSettings.viewMode"
          :options="viewModeSetting.options"
          :disabled="stratSettings.attackEvent === 'only'"
          :on-value-change="viewModeSetting.onChange"
        />
        <RadioGroup
          :name="readMode.name"
          :default-value="stratSettings.readMode"
          :options="readMode.options"
          :on-value-change="readMode.onChange"
        />
        <RadioGroup
          :name="attackEventSetting.name"
          :default-value="stratSettings.attackEvent"
          :options="attackEventSetting.options"
          :on-value-change="attackEventSetting.onChange"
        />
        <RadioGroup
          :name="timelineOriginSetting.name"
          :default-value="stratSettings.timelineOrigin"
          :options="timelineOriginSetting.options"
          :on-value-change="timelineOriginSetting.onChange"
        />
        <RadioGroup
          :name="timeFormatSetting.name"
          :default-value="stratSettings.timeFormat"
          :options="timeFormatSetting.options"
          :on-value-change="timeFormatSetting.onChange"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>
