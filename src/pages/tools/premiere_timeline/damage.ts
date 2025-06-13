export interface DamageInfoData {
  time: string
  name: string
  type: 'physical' | 'magical' | 'special'
  value: string
  areaOnly?: boolean
}
