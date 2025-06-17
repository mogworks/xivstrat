import { persistentMap } from '@nanostores/persistent'

export interface StratSettings {
  viewMode: 'default' | 'solution' | 'timeline' | 'damage'
  readMode: 'standard' | 'minimal'
  readModeRefresh: 'true' | 'false' // 用于重新触发DutyStratLayout里的相关代码，按阅读模式修改元素
  attackEvent: 'hide' | 'show' | 'only'
  timelineOrigin: 'global' | 'phase'
  timeFormat: 'mm:ss' | 's'
  pixijsApiPreference: 'webgpu' | 'webgl'
}

type StratSettingsValue = StratSettings[keyof StratSettings]

export const $stratSettings = persistentMap<StratSettings>(
  'stratSettings:',
  {
    viewMode: 'default',
    readMode: 'standard',
    readModeRefresh: 'false',
    attackEvent: 'hide',
    timelineOrigin: 'global',
    timeFormat: 'mm:ss',
    pixijsApiPreference: 'webgpu',
  },
  {
    encode: (value: StratSettingsValue) => value,
    decode: (encoded: string) => encoded as StratSettingsValue,
  }
)
