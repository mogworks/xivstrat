import { Assets, Container, Sprite } from 'pixi.js'
import { z } from 'zod'

import { getScale, YmToPx } from './utils'

const _waymarkPositionSchema = z.object({
  X: z.number(),
  Z: z.number(),
  alpha: z.number().optional(),
  rotation: z.number().optional(),
})

const _waymarkDataSchema = z.object({
  A: _waymarkPositionSchema.optional(),
  B: _waymarkPositionSchema.optional(),
  C: _waymarkPositionSchema.optional(),
  D: _waymarkPositionSchema.optional(),
  One: _waymarkPositionSchema.optional(),
  Two: _waymarkPositionSchema.optional(),
  Three: _waymarkPositionSchema.optional(),
  Four: _waymarkPositionSchema.optional(),
})

export type WaymarkType = 'A' | 'B' | 'C' | 'D' | 'One' | 'Two' | 'Three' | 'Four'
export type WaymarkPosition = z.infer<typeof _waymarkPositionSchema>
export type WaymarkData = z.infer<typeof _waymarkDataSchema>

export class Waymark extends Container {
  type: WaymarkType
  fgSprite?: Sprite
  bgSprite?: Sprite

  constructor(type: WaymarkType) {
    super()
    this.type = type
  }

  async init() {
    const key = {
      A: 'a',
      B: 'b',
      C: 'c',
      D: 'd',
      One: 1,
      Two: 2,
      Three: 3,
      Four: 4,
    }[this.type]

    const bg_texture = await Assets.load(`waymark/${key}_bg.png`)
    const bg_sprite = Sprite.from(bg_texture)
    bg_sprite.anchor.set(0.5, 0.5)
    bg_sprite.scale.set(getScale())
    this.bgSprite = bg_sprite
    this.addChild(bg_sprite)

    const fg_texture = await Assets.load(`waymark/${key}.png`)
    const fg_sprite = Sprite.from(fg_texture)
    fg_sprite.anchor.set(0.5, 0.5)
    fg_sprite.scale.set(0.5)
    this.fgSprite = fg_sprite
    this.addChild(fg_sprite)
  }
}

export async function setWaymark(container: Container, payload: WaymarkData, alpha = 1) {
  const waymarks = new Map<WaymarkType, Waymark>()
  for (const key in payload) {
    const k = key as WaymarkType
    const v = payload[k]!
    const waymark = new Waymark(k)
    await waymark.init()
    waymark.position.set(v.X * YmToPx, v.Z * YmToPx)
    waymark.alpha = v.alpha ?? alpha
    waymark.fgSprite!.rotation = v.rotation ?? 0
    container.addChild(waymark)
    waymarks.set(k, waymark)
  }
  return waymarks
}
