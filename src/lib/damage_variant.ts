import skywardLeap from '@/assets/damage_variant/skyward_leap.png'
import stack from '@/assets/damage_variant/stack.png'

// TODO: 添加各种类型，如射线死刑的icon，单体死刑的icon等等
export type DamageVariantType = 'stack' | 'skywardLeap'

export const damageVariantIconMap: Record<DamageVariantType, ImageMetadata> = {
  stack,
  skywardLeap,
}
