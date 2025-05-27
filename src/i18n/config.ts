import type { TLocales, TLocalesDict, TSupportedLocales } from './type'

import zhHome from './locales/zh/home.json'
import enHome from './locales/en/home.json'
import jaHome from './locales/ja/home.json'

export const supportedLocales: TSupportedLocales[] = ['en', 'zh', 'ja']

export const locales: TLocales = {
  en: {
    label: 'English',
    lang: 'en-US',
  },
  zh: {
    label: '中文',
    lang: 'zh-CN',
  },
  ja: {
    label: '日本語',
    lang: 'ja',
  },
}

export const defaultLocale = 'zh'

export const translationsDict: TLocalesDict = {
  zh: {
    home: zhHome,
    mech: zhHome,
  },
  en: {
    home: enHome,
    mech: enHome,
  },
  ja: {
    home: jaHome,
    mech: jaHome,
  },
}
