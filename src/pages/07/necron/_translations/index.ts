import * as en from './en'
import * as jp from './jp'

// 创建合并字典，将英文和日文值拼接
export const combinedTranslations = Object.keys(en.translations).reduce(
  (acc, key) => {
    const strKey = key as keyof typeof en.translations
    acc[strKey] = `${en.translations[strKey]} / ${jp.translations[strKey]}`
    return acc
  },
  {} as typeof en.translations
)
