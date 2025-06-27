import type { Application, Texture } from 'pixi.js'

import { animate } from 'motion'
import { Container, Graphics, Sprite } from 'pixi.js'

import type { AoEColors } from '@/pixi/aoe'

import { AoE, AOE_COLORS } from '@/pixi/aoe'
import { YmToPx } from '@/pixi/utils'

const centerToNorth = 17.54 * Math.cos(Math.PI / 5) + 8
const centerToSouth = 17.54 + 8
const radius = 17.54
const scale = 1.25
const YmToPxLarge = YmToPx * scale

const UNIT_RAD = (2 * Math.PI) / 5
// 浮游炮平移距离（m）
// 8m半径的台子，暂定平移4m
const fangAdjust = 4

function getDirectionSign(i: number, pattern: number): { x: number; y: number } {
  // const sign = pattern === 0 ? -1 : 1
  // return { x: sign, y: sign }
  return {
    x: (-1) ** pattern,
    y: (-1) ** (2 * i + 1) * (-1) ** pattern,
  } // 0 => 右，1 => 左
}

function polarRadianToCartesian(polar: { r: number; rad: number }): { x: number; y: number } {
  const x = polar.r * Math.cos(polar.rad)
  const y = polar.r * Math.sin(polar.rad)
  return { x, y }
}

function cartesianToPolarRadian(cartesian: { x: number; y: number }): { r: number; rad: number } {
  const r = Math.sqrt(cartesian.x ** 2 + cartesian.y ** 2)
  const rad = Math.atan2(cartesian.y, cartesian.x)
  return { r, rad }
}

// 以南侧为基准，pattern 0是右边激活，pattern 1是左边激活
export class Fang extends Container {
  private app: Application
  private texture: Texture
  private rotate: 0 | 1 | 2 | 3 | 4
  private pattern: 0 | 1
  private activate: boolean
  private aoeColor: Partial<AoEColors>

  private sprite: Sprite
  private shot?: Sprite
  private shotMask?: Graphics

  constructor(
    app: Application,
    texture: Texture,
    options: {
      rotate?: 0 | 1 | 2 | 3 | 4
      pattern?: 0 | 1
      activate?: boolean
      aoeColor?: Partial<AoEColors>
    } = {}
  ) {
    super()
    this.app = app
    this.texture = texture
    this.rotate = options.rotate ?? 0
    this.pattern = options.pattern ?? 0
    this.activate = options.activate ?? false
    this.aoeColor = options.aoeColor ?? AOE_COLORS.tailwind.emerald

    this.sprite = Sprite.from(texture)
    this.sprite.anchor.set(0.5, centerToNorth / (centerToNorth + centerToSouth))
    this.sprite.scale.set(2)
    this.addChild(this.sprite)

    if (this.activate) {
      this.createShot()
    }

    this.update()
  }

  public setPattern(pattern: 0 | 1) {
    this.pattern = pattern
    this.update()
  }

  public setRotate(rotate: 0 | 1 | 2 | 3 | 4) {
    this.rotate = rotate
    this.update()
  }

  private createShot() {
    if (!this.shot) {
      this.shot = AoE.createRect(8 * scale, 16 * scale, this.aoeColor).toSprite(this.app)
      this.addChild(this.shot)
    }
    if (!this.shotMask) {
      this.shotMask = new Graphics()
      this.shot.mask = this.shotMask

      this.addChild(this.shotMask)
    }
  }

  private update() {
    const radian = (this.rotate + 1) * UNIT_RAD
    const dir = getDirectionSign(this.rotate, this.pattern)

    this.sprite.rotation = radian - UNIT_RAD
    const p_adjust = polarRadianToCartesian({
      r: radius + 8,
      rad: radian + UNIT_RAD / 4,
    })

    this.sprite.position.set(
      (p_adjust.x + dir.x * fangAdjust * Math.sin(radian + UNIT_RAD / 4)) * YmToPxLarge,
      (p_adjust.y + dir.y * fangAdjust * Math.cos(radian + UNIT_RAD / 4)) * YmToPxLarge
    )

    // if (this.shot) this.removeChild(this.shot)
    // if (this.shotMask) this.removeChild(this.shotMask)

    if (this.activate && this.shot && this.shotMask) {
      const pos = {
        x: -radius * scale * Math.sin(this.rotate * UNIT_RAD) * YmToPx,
        y: radius * scale * Math.cos(this.rotate * UNIT_RAD) * YmToPx,
      }

      this.shot.position.set(pos.x, pos.y)
      this.shot.rotation = radian - UNIT_RAD
      const prCoor = cartesianToPolarRadian(pos)
      this.shot.position.set(
        this.shot.position.x + dir.x * fangAdjust * Math.sin(prCoor.rad) * YmToPxLarge,
        this.shot.position.y + dir.y * fangAdjust * Math.cos(prCoor.rad) * YmToPxLarge,
      )

      const r = this.rotate * UNIT_RAD
      this.shotMask.circle(
        -17.54 * YmToPxLarge * Math.sin(r),
        17.54 * YmToPxLarge * Math.cos(r),
        8 * YmToPxLarge
      )
      this.shotMask.fill({ color: 'white' })
    }
  }
}

interface RightFangs {
  inactive: Fang
  prepared?: Fang
  active?: Fang
}

export type FangType = 'inactive' | 'prepared' | 'active'
// type RightFangs = Partial<Record<FangType, Fang>>

export class FangPair {
  left: Fang
  right: RightFangs

  constructor(left: Fang, right: Fang) {
    this.left = left
    this.right = { inactive: right }
  }

  public addRemainingFangs(prepared: Fang, active: Fang) {
    this.right.prepared = prepared
    this.right.active = active
  }

  public hasAllState() {
    return !!((this.right.prepared && this.right.active))
  }

  // 0 => right, 1 => left
  public switchSide(pattern: 0 | 1): FangPair {
    this.left.setPattern(pattern === 0 ? 1 : 0)
    this.right.inactive.setPattern(pattern)
    this.right.prepared?.setPattern(pattern)
    this.right.active?.setPattern(pattern)

    return this
  }

  public loadPair(container: Container, state: FangType = 'inactive') {
    container.addChild(this.left)
    container.addChild(this.getFangByState(state))
  }

  public async fadeInPair(container: Container, state: FangType = 'inactive'): Promise<void> {
    container.addChild(this.left)
    const right = this.getFangByState(state)

    right.alpha = 0
    container.addChild(right)

    const [rightAnim, leftAnim] = [
      animate([[right, { alpha: 1 }, { duration: 0.1 }]]),
      animate([[this.left, { alpha: 1 }, { duration: 0.1 }]])
    ]

    await Promise.all([rightAnim.finished, leftAnim.finished])
  }

  public async fadeOutPair(container: Container): Promise<void> {
    const all = [this.right.inactive, this.right.prepared, this.right.active]

    const promises = all
      .filter((f): f is Fang => !!f && container.children.includes(f))
      .map(f =>
        animate([[f, { alpha: 0 }, { duration: 0.1 }]])
          .finished
          .then(() => container.removeChild(f))
      )

    await Promise.all(promises)

    container.removeChildren()
  }

  private getFangByState(state: FangType): Fang {
    if (state === 'prepared' && this.right.prepared) {
      return this.right.prepared
    }
    if (state === 'active' && this.right.active) {
      return this.right.active
    }
    return this.right.inactive
  }
}
