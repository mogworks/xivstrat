import { supportedLocales } from './config'

export type TSupportedLocales = 'en' | 'zh' | 'ja'
export type TLocalesTarget = 'home' | 'mech'
export type TLocales = Partial<
  Record<
    TSupportedLocales,
    {
      label: string
      lang: string
    }
  >
>
export type TLocalesDict = Partial<Record<TSupportedLocales, Record<TLocalesTarget, Record<string, string>>>>
