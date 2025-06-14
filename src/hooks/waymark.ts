import { listenKeys } from 'nanostores'
import { Assets, Container, Sprite } from 'pixi.js'

import { getScale } from '@/pixi/utils'
import { setWaymark, type WaymarkData } from '@/pixi/waymark'
import { $stratBoards } from '@/stores/stratBoards'

export interface UseWaymarkOptions {
  anchor?: {
    x?: number
    y?: number
  }
  alpha?: number
}

const defaultOptions: UseWaymarkOptions = {
  anchor: {
    x: 0.5,
    y: 0.5,
  },
  alpha: 0.5,
}

export function useWaymark(waymarkData: WaymarkData, floorImageSrc: string, key: string, options?: UseWaymarkOptions) {
  const combinedOptions = { ...defaultOptions, ...options }
  listenKeys($stratBoards, [key], async (stratBoards) => {
    const app = stratBoards[key]

    const container = new Container()
    container.position.set(app.screen.width / 2, app.screen.height / 2)
    app.stage.addChild(container)

    const floorTexture = await Assets.load(floorImageSrc)
    const floor = Sprite.from(floorTexture)
    floor.anchor.set(combinedOptions.anchor?.x, combinedOptions.anchor?.y)
    floor.scale.set(getScale())
    container.addChild(floor)

    await setWaymark(container, waymarkData, combinedOptions.alpha)
  })
}
