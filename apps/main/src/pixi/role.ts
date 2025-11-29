import type { CombinedRoleType, RoleType } from '@/lib/role'

import { CombinedIcon, Icon } from './icon'

const roleImgMap = {
  any: 'role/any.png',
  all: 'role/all.png',
  tank: 'role/tank.png',
  healer: 'role/healer.png',
  dps: 'role/dps.png',
  melee: 'role/melee.png',
  ranged: 'role/ranged.png',
  magic: 'role/magic.png',
  ranged_magic: 'role/ranged_magic.png',
  boss: 'enemy/061712.png',
  enemy_level1: 'enemy/061707.png',
}

export class Role extends Icon {
  role: RoleType
  tag: string = ''

  constructor(role: RoleType, tag: string = '') {
    super(roleImgMap[role], tag)
    this.role = role
    this.tag = tag
  }
}

export class CombinedRole extends CombinedIcon {
  role: CombinedRoleType
  tag: string = ''

  constructor(role1: 'tank' | 'healer' | 'dps', role2: 'tank' | 'healer' | 'dps', tag: string = '') {
    super(roleImgMap[role1], roleImgMap[role2], tag)
    this.role = `${role1}|${role2}` as CombinedRoleType
    this.tag = tag
  }
}
