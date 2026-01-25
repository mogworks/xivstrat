const skywardLeap = 'damage_variant/skyward_leap.webp'
const stack = 'damage_variant/stack.webp'

// TODO: 添加各种类型，如射线死刑的icon，单体死刑的icon等等
export type DamageVariantType = 'stack' | 'skywardLeap'

export const damageVariantIconMap: Record<DamageVariantType, string> = {
  stack,
  skywardLeap,
}
