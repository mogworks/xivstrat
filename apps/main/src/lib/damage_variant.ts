const skywardLeap = 'imgs/damage_variant/skyward_leap.png?width=100&height=100'
const stack = 'imgs/damage_variant/stack.png?width=100&height=100'

// TODO: 添加各种类型，如射线死刑的icon，单体死刑的icon等等
export type DamageVariantType = 'stack' | 'skywardLeap'

export const damageVariantIconMap: Record<DamageVariantType, string> = {
  stack,
  skywardLeap,
}
