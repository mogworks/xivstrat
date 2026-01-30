import { useStore } from '@nanostores/react'
import { $resolvedTheme } from '@/stores/theme'

export function useTheme() {
  return useStore($resolvedTheme)
}
