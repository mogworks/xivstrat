export type RoleType =
  | 'any'
  | 'all'
  | 'tank'
  | 'healer'
  | 'dps'
  | 'melee'
  | 'ranged'
  | 'magic'
  | 'ranged_magic'
  | 'boss'
  | 'enemy_level1'

export type CombinedRoleType = 'tank|healer' | 'healer|tank' | 'tank|dps' | 'dps|tank' | 'healer|dps' | 'dps|healer'
