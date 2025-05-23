import { Icon } from './icon'

export type RoleType =
  | 'any'
  | 'all'
  | 'tank'
  | 'healer'
  | 'dps'
  | 'melee'
  | 'ranged'
  | 'magic'
  | 'boss'
  | 'enemy_level1'

export class Role extends Icon {
  role: RoleType
  tag: string = ''

  constructor(role: RoleType, tag: string = '') {
    super(
      {
        any: 'role/any.png',
        all: 'role/all.png',
        tank: 'role/tank.png',
        healer: 'role/healer.png',
        dps: 'role/dps.png',
        melee: 'role/melee.png',
        ranged: 'role/ranged.png',
        magic: 'role/magic.png',
        boss: 'enemy/061712.png',
        enemy_level1: 'enemy/061707.png',
      }[role],
      tag,
    )
    this.role = role
    this.tag = tag
  }
}
