import type { ClassValue } from 'clsx'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

import type { Route } from '@/components/navigator/type'

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

export function copyToClipboard(text?: string | null) {
  if (!text) {
    return false
  }
  // 老浏览器兼容方案
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
    } else if (document.queryCommandSupported('copy')) {
      // fallback
      document.execCommand('copy')
    }
    return true
  } catch (err) {
    console.error(err)
    return false
  } finally {
    document.body.removeChild(textArea)
  }
}

/* eslint-disable no-new */
export function isValidURL(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}
/* eslint-enable no-new */

export function splitDamage(damage: string): string {
  // 只匹配>=4位
  return damage.replace(/(-?)(\d{4,}(?:\.\d+)?)(?=[^.\d]|$)/g, (_, sign, num) => {
    const [integer, fraction] = num.split('.')
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    // 非伤害数字部分 + 格式化的整数 + 直接贴上的小数
    return sign + formattedInteger + (fraction ? `.${fraction}` : '')
  })
}

export function findOrCreateRouteNode(parentLevel: Route[], nodeName: string): Route {
  let node = parentLevel.find(item => item.name === nodeName)
  if (!node) {
    node = { name: nodeName, children: [] }
    parentLevel.push(node)
  } else if (node.path) {
    // 不允许叶子节点和目录节点同名冲突
    throw new Error(`'${nodeName}' 已定义为叶子节点（含path），不能作为目录`)
  }
  return node
}

export async function getJSONHash(data: unknown, algorithm: AlgorithmIdentifier = 'SHA-256'): Promise<string> {
  function createCanonicalJSON(data: unknown): string {
    if (data === null || typeof data !== 'object') {
      return JSON.stringify(data)
    }

    if (Array.isArray(data)) {
      const items = data.map(item => createCanonicalJSON(item))
      return `[${items.join(',')}]`
    }

    const sortedKeys = Object.keys(data).sort()
    const items = sortedKeys.map((key) => {
      const value = createCanonicalJSON((data as Record<string, unknown>)[key])
      return `${JSON.stringify(key)}:${value}`
    })

    return `{${items.join(',')}}`
  }
  function bufferToHex(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer)
    return Array.from(byteArray)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
  }
  const jsonString = createCanonicalJSON(data)

  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(jsonString)

  const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer)

  return bufferToHex(hashBuffer)
}
