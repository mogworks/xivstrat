import { defaultLocale, translationsDict } from './config'
import type { TLocalesTarget, TSupportedLocales } from './type'

export const useI18n = (lang: TSupportedLocales, target: TLocalesTarget) => {
  const _i18n = (key: string, ...args: string[]) => {
    const targetDict = translationsDict[lang]?.[target] || translationsDict[defaultLocale]![target]
    if (!targetDict) {
      console.error(`Language ${lang} with target ${target} is not supported for i18n`)
      return key // 防止空白显示
    }
    const translation = targetDict[key]
    if (!translation) {
      console.error(`${key} is not defined in dictionary with language ${lang} and target ${target}`)
      return key
    }

    /**
     * 占位符替换
     *
     * 如下，此时 $1 $2 不被翻译
     * $1: David, $2: The Eras Tour
     * $1, I went to $2 last year
     * $1, 我去年去了 $2
     */
    if (args.length > 0) {
      return args.reduce((text, arg, index) => {
        return text.replace(`$${index + 1}`, arg)
      }, translation)
    }

    return translation
  }
  return _i18n
}
