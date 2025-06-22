import type { GlowFilterOptions } from 'pixi-filters'
import type { Application, FillInput, Graphics } from 'pixi.js'

import { GlowFilter } from 'pixi-filters'
import { Container, Point, Rectangle, Sprite, Texture } from 'pixi.js'

import * as G from './graphics'
import { DEFAULT_AOE_RESOLUTION } from './resolutions'
import { YmToPx } from './utils'

export const AOE_COLORS = {
  default: {
    aoe: '#fb923c',
    innerShadow: '#ff751f',
    outerGlow: '#fffc79',
  },
  tailwind: {
    emerald: {
      aoe: '#34d399',
      innerShadow: '#047857',
      outerGlow: '#6ee7b7',
    },
  },
}

export type AoEColors = typeof AOE_COLORS.default

export type AoEType = 'rect' | 'ray' | 'circle' | 'ring' | 'fan' | 'x' | 'ringFan'

export class AoETexture extends Texture {
  type: AoEType
  resolution: number

  constructor(texture: Texture, type: AoEType, resolution: number) {
    super(texture)
    this.type = type
    this.resolution = resolution
  }

  getCenterPivot() {
    if (this.type === 'ray' || this.type === 'fan') {
      return new Point(YmToPx * this.resolution, this.height / 2)
    } else {
      return new Point(this.width / 2, this.height / 2)
    }
  }
}

export class AoE extends Container {
  type: AoEType
  resolution: number

  constructor(
    type: AoEType,
    resolution: number,
    fn: (style?: FillInput) => Graphics,
    colors?: Partial<AoEColors>,
  ) {
    super()

    this.type = type
    this.resolution = resolution

    const innerShadow = AoE.createInnerShadow(
      fn,
      { color: colors?.innerShadow ?? AOE_COLORS.default.innerShadow },
      resolution,
    )
    const outerGlow = AoE.createOuterGlow(
      fn,
      { color: colors?.outerGlow ?? AOE_COLORS.default.outerGlow },
      resolution,
    )
    const aoe = fn({ color: colors?.aoe ?? AOE_COLORS.default.aoe, alpha: 0.25 })

    innerShadow.label = 'inner_shadow'
    outerGlow.label = 'outer_glow'
    aoe.label = 'aoe'

    this.addChild(innerShadow)
    this.addChild(outerGlow)
    this.addChild(aoe)
  }

  /**
   * 将当前AoE容器转换为纹理，以避免父容器添加遮罩时，出现光效残留bug
   */
  toTexture(app: Application) {
    const rectangle = this.getComputedRectangle()
    return new AoETexture(app.renderer.extract.texture({ target: this, frame: rectangle }), this.type, this.resolution)
  }

  /**
   * 将当前AoE容器转换为精灵，理由同上
   */
  toSprite(app: Application) {
    const texture = this.toTexture(app)
    const sprite = Sprite.from(texture)
    const centerPivot = texture.getCenterPivot()
    sprite.pivot.set(centerPivot.x, centerPivot.y)
    sprite.scale.set(1 / this.resolution)
    return sprite
  }

  /**
   * 创建矩形AoE效果
   */
  static createRect(width: number, height: number, color?: Partial<AoEColors>): AoE {
    const resolution = DEFAULT_AOE_RESOLUTION

    return new AoE(
      'rect',
      resolution,
      style => G.createRectGraphics(width, height, style, resolution),
      color ?? AOE_COLORS.default
    )
  }

  /**
   * 批量创建矩形AoE效果
   */
  static createRects(
    app: Application,
    params: { position?: { x: number; y: number }; rotation?: number; width?: number; height?: number; color: Partial<AoEColors> }[],
    defaultWidth: number = 0,
    defaultHeight: number = 0,
    defaultColor: Partial<AoEColors> = AOE_COLORS.default,
  ) {
    const c = new Container()
    params.forEach((param) => {
      const rect = AoE.createRect(
        param.width ?? defaultWidth,
        param.height ?? defaultHeight,
        param.color ?? defaultColor,
      ).toSprite(app)
      rect.position = param.position ? { x: param.position.x * YmToPx, y: param.position.y * YmToPx } : { x: 0, y: 0 }
      rect.rotation = param.rotation ? (param.rotation * Math.PI) / 180 : 0
      c.addChild(rect)
    })
    return c
  }

  /**
   * 创建环形AoE效果
   */
  static createRing(innerRadius: number, outerRadius: number): AoE {
    if (innerRadius >= outerRadius) {
      throw new Error('内圆半径必须小于外圆半径')
    }

    const resolution = DEFAULT_AOE_RESOLUTION

    return new AoE(
      'ring',
      resolution,
      style => G.createRingGraphics(innerRadius, outerRadius, style, resolution),
    )
  }

  /**
   * 创建扇形AoE效果
   */
  static createFan(radius: number, angle: number): AoE {
    const resolution = DEFAULT_AOE_RESOLUTION

    const aoe = new AoE(
      'fan',
      resolution,
      style => G.createFanGraphics(radius, angle, style, resolution),
    )
    return aoe
  }

  /**
   * 创建部分的环形AoE效果
   */
  static createRingFan(innerRadius: number, outerRadius: number, angle: number): AoE {
    const resolution = DEFAULT_AOE_RESOLUTION

    const aoe = new AoE(
      'ringFan',
      resolution,
      style => G.createRingFanGraphics(innerRadius, outerRadius, angle, style, resolution),
    )
    return aoe
  }

  private getComputedRectangle() {
    const bounds = this.getLocalBounds()
    const rect = new Rectangle(
      bounds.x - YmToPx * this.resolution,
      bounds.y - YmToPx * this.resolution,
      bounds.width + YmToPx * this.resolution * 2,
      bounds.height + YmToPx * this.resolution * 2,
    )
    return rect
  }

  private static createInnerShadow(
    fn: (style?: FillInput) => Graphics,
    options: GlowFilterOptions = {},
    resolution = DEFAULT_AOE_RESOLUTION,
  ) {
    const c = new Container()
    const g = fn({ color: 'white', alpha: 1 })
    c.addChild(g)
    c.filters = [
      new GlowFilter({
        alpha: options.alpha ?? 0.6,
        color: options.color ?? AOE_COLORS.default.innerShadow,
        distance: (options.distance ?? 36) * resolution,
        innerStrength: options.innerStrength ?? 4,
        outerStrength: options.outerStrength ?? 0,
        quality: options.quality ?? 0.5,
        knockout: options.knockout ?? true,
      }),
    ]
    return c
  }

  private static createOuterGlow(
    fn: (style?: FillInput) => Graphics,
    options: GlowFilterOptions = {},
    resolution = DEFAULT_AOE_RESOLUTION,
  ) {
    const c = new Container()
    const g = fn({ color: 'white', alpha: 1 })
    c.addChild(g)
    c.filters = [
      new GlowFilter({
        alpha: options.alpha ?? 0.6,
        color: options.color ?? AOE_COLORS.default.outerGlow,
        distance: (options.distance ?? 10) * resolution,
        innerStrength: options.innerStrength ?? 5,
        outerStrength: options.outerStrength ?? 0,
        quality: options.quality ?? 0.5,
        knockout: options.knockout ?? true,
      }),
    ]
    return c
  }
}
