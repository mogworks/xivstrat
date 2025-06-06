import type { VariantType } from '@/lib/variant'

export interface Img {
  src: ImageMetadata
  alt: string
  title?: string
  bordered?: boolean
  borderVariant?: VariantType
  rounded?: boolean
  class?: string
  imgClass?: string
  titleClass?: string
}

// 边框颜色映射（动态使用tailwind时，类名必须完整，不能拼接）
export const borderColorMap: Record<VariantType, string> = {
  default: 'border-foreground/75',
  red: 'border-red-700 dark:border-red-100',
  orange: 'border-orange-700 dark:border-orange-100',
  amber: 'border-amber-800/75 dark:border-amber-100',
  yellow: 'border-yellow-700 dark:border-yellow-100',
  lime: 'border-lime-700 dark:border-lime-100',
  green: 'border-green-700 dark:border-green-100',
  emerald: 'border-emerald-700 dark:border-emerald-100',
  teal: 'border-teal-700 dark:border-teal-100',
  cyan: 'border-cyan-700 dark:border-cyan-100',
  sky: 'border-sky-700 dark:border-sky-100',
  blue: 'border-blue-700 dark:border-blue-100',
  indigo: 'border-indigo-700 dark:border-indigo-100',
  violet: 'border-violet-700 dark:border-violet-100',
  purple: 'border-purple-700 dark:border-purple-100',
  fuchsia: 'border-fuchsia-400 dark:border-fuchsia-100',
  pink: 'border-pink-700 dark:border-pink-100',
  rose: 'border-rose-700 dark:border-rose-100',
  slate: 'border-slate-700 dark:border-slate-100',
  gray: 'border-gray-700 dark:border-gray-100',
  zinc: 'border-zinc-700 dark:border-zinc-100',
  neutral: 'border-neutral-700 dark:border-neutral-100',
  stone: 'border-stone-700 dark:border-stone-100',
}
