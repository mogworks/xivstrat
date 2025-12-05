<script setup lang="ts">
import { useStore } from '@nanostores/vue'

import RadioGroup from '@/components/StratSettingsRadioGroup.vue'
import TriggerButton from '@/components/StratSettingsTriggerButton.vue'
import { $stratSettings } from '@/stores/stratSettings'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from '@xivstrat/shadcn-vue'

const stratSettings = useStore($stratSettings)

const readModeSetting = {
  name: '阅读模式',
  options: [
    {
      id: 'standard',
      name: '标准模式',
      description: '职能图标、敌人图标等正常显示，文本高亮色正常显示',
    },
    {
      id: 'minimal',
      name: '简洁模式',
      description: '职能图标、敌人图标等以文字显示，文本不显示高亮色',
    },
  ],
  onChange: (value: string) => {
    $stratSettings.setKey('readMode', value as 'standard' | 'minimal')
  },
}

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

const damageFormatSetting = {
  name: '伤害值格式',
  options: [
    {
      id: 'split',
      name: '千位分隔',
      description: '如：99,999,999',
    },
    {
      id: 'full',
      name: '不分隔',
      description: '如：99999999',
    },
  ],
  onChange: (value: string) => {
    $stratSettings.setKey('damageFormat', value as 'split' | 'full')
  },
}

const pixijsApiPreferenceSetting = {
  name: '动态演示优先使用的图形API（修改后需要刷新页面）',
  options: [
    {
      id: 'webgpu',
      name: 'WebGPU',
      description: '默认选项，性能更好，但部分较旧的浏览器可能有兼容性问题，若遇到动态演示不动，请尝试切换到 WebGL',
    },
    {
      id: 'webgl',
      name: 'WebGL',
      description: '性能稍差一些，但兼容性更好',
    },
  ],
  onChange: (value: string) => {
    $stratSettings.setKey('pixijsApiPreference', value as 'webgpu' | 'webgl')
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
          :name="readModeSetting.name"
          :default-value="stratSettings.readMode"
          :options="readModeSetting.options"
          :on-value-change="readModeSetting.onChange"
        />
        <RadioGroup
          :name="viewModeSetting.name"
          :default-value="stratSettings.viewMode"
          :options="viewModeSetting.options"
          :disabled="stratSettings.attackEvent === 'only'"
          :on-value-change="viewModeSetting.onChange"
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
        <RadioGroup
          :name="damageFormatSetting.name"
          :default-value="stratSettings.damageFormat"
          :options="damageFormatSetting.options"
          :on-value-change="damageFormatSetting.onChange"
        />
        <RadioGroup
          :name="pixijsApiPreferenceSetting.name"
          :default-value="stratSettings.pixijsApiPreference"
          :options="pixijsApiPreferenceSetting.options"
          :on-value-change="pixijsApiPreferenceSetting.onChange"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>
