import type { FillInput } from 'pixi.js'

import { Graphics } from 'pixi.js'

import { DEFAULT_AOE_RESOLUTION } from './resolutions'
import { YmToPx } from './utils'

export function createRectGraphics(
  width: number,
  height: number,
  style?: FillInput,
  resolution = DEFAULT_AOE_RESOLUTION,
) {
  const rect = new Graphics()
    .rect(
      (-width * YmToPx * resolution) / 2,
      (-height * YmToPx * resolution) / 2,
      width * YmToPx * resolution,
      height * YmToPx * resolution,
    )
    .fill(style)
  return rect
}

export function createRingGraphics(
  innerRadius: number,
  outerRadius: number,
  style?: FillInput,
  resolution = DEFAULT_AOE_RESOLUTION,
) {
  const ring = new Graphics()
    .circle(0, 0, outerRadius * YmToPx * resolution)
    .fill(style)
    .circle(0, 0, innerRadius * YmToPx * resolution)
    .cut()
  return ring
}

export function createFanGraphics(
  radius: number,
  angle: number,
  style?: FillInput,
  resolution = DEFAULT_AOE_RESOLUTION,
) {
  const fan = new Graphics()
    .arc(0, 0, radius * YmToPx * resolution, (-angle * Math.PI) / 360, (angle * Math.PI) / 360)
    .lineTo(0, 0)
    .closePath()
    .fill(style)
  return fan
}

export function createRingFanGraphics(
  innerRadius: number,
  outerRadius: number,
  angle: number,
  style?: FillInput,
  resolution = DEFAULT_AOE_RESOLUTION,
) {
  const resFactor = YmToPx * resolution
  const start = (-angle * Math.PI) / 360
  const end = (angle * Math.PI) / 360

  const g = new Graphics()
    .arc(0, 0, outerRadius * resFactor, start, end)
    .arc(0, 0, innerRadius * resFactor, end, start, true)
    .closePath()
    .fill(style)

  return g
}
