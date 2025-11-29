import { resolutions } from './resolutions'

// 设计值：希望经过getScale缩放后，游戏内1Ym对应的PixiJs画布像素数
export const YmToPx = 10

// 测量值：未缩放情况下，相机高度=36.5，FOV=1，窗口高度=2160时，游戏内40Ym刚好占满俯视图宽度
export const YmToPxMap = {
  36.5: 54, // 2160/40=54
  50: 39.42, // 若相机高度为50，则为54/50*36.5=39.42
}

export const getScale = (distance: number = 50, fov: number = 1, gameScreenHeight: number = 2160) => {
  return (
    // R ∝ Distance × tan(FOV / 2)
    ((distance * Math.tan(fov * 0.5)) / (36.5 * Math.tan(1 * 0.5))) *
    (2160 / gameScreenHeight) *
    (YmToPx / YmToPxMap[36.5]) *
    Math.max(...resolutions)
  )
}
