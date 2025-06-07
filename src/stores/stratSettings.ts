import { persistentMap } from '@nanostores/persistent'

export interface StratSettings {
  viewMode: 'default' | 'solution' | 'timeline' | 'damage'
  readMode: 'standard' | 'minimal'
  attackEvent: 'hide' | 'show' | 'only'
  timelineOrigin: 'global' | 'phase'
  timeFormat: 'mm:ss' | 's'
}

type StratSettingsValue = StratSettings[keyof StratSettings]

export const $stratSettings = persistentMap<StratSettings>(
  'stratSettings:',
  {
    viewMode: 'default',
    readMode: 'standard',
    attackEvent: 'hide',
    timelineOrigin: 'global',
    timeFormat: 'mm:ss',
  },
  {
    encode: (value: StratSettingsValue) => value,
    decode: (encoded: string) => encoded as StratSettingsValue,
  }
)
