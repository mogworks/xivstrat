import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const timeSchema = z.union([
  z.number(), // 127.4
  z.string().regex(/^\d+(?:\.\d+)?$/), // '127.4'
  z.string().regex(/^(?:[0-5]\d|\d):(?:[0-5]\d|\d)(?:\.\d+)?$/), // '02:07.4'
])
export type Time = z.infer<typeof timeSchema>

export function timeToSeconds(time: Time) {
  const r = timeSchema.safeParse(time)
  const arr = r.success ? r.data.toString().split(':') : ['0', '0']
  const [minutes, seconds] = arr.length === 1 ? ['0', ...arr] : arr
  return Number(minutes) * 60 + Number(seconds)
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function omit<T extends object, K extends keyof T>(obj: T, keysToExclude: K | K[]): Omit<T, K> {
  const excludeSet = new Set(Array.isArray(keysToExclude) ? keysToExclude : [keysToExclude])
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !excludeSet.has(key as K))) as Omit<T, K>
}
