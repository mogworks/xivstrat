import { Assets, Container, Graphics, Sprite, Text, TextStyle } from 'pixi.js'

export class Icon extends Container {
  img: string
  tag: string = ''

  constructor(img: string, tag: string = '') {
    super()
    this.img = img
    this.tag = tag
    this.init()
  }

  private async init() {
    const texture = await Assets.load(this.img)
    const sprite = Sprite.from(texture)
    sprite.anchor.set(0.5, 0.5)
    this.addChild(sprite)

    if (!this.tag) {
      return
    }

    const textStyle = new TextStyle({
      dropShadow: {
        alpha: 0.6,
        color: '#000000',
        blur: 8,
        angle: Math.PI / 6,
        distance: 2,
      },
      fill: '#ffffff',
      stroke: { color: '#000000', width: 4, join: 'round' },
      fontSize: 28,
      fontWeight: 'lighter',
    })

    const text = new Text({
      text: this.tag,
      style: textStyle,
    })
    text.anchor.set(0.5, -0.3)
    this.addChild(text)
  }
}

export class CombinedIcon extends Container {
  img1: string
  img2: string

  tag: string = ''

  constructor(img1: string, img2: string, tag: string = '') {
    super()
    this.img1 = img1
    this.img2 = img2
    this.tag = tag
    this.init()
  }

  private async init() {
    const texture1 = await Assets.load(this.img1)
    const texture2 = await Assets.load(this.img2)

    const sprite1 = Sprite.from(texture1)
    const sprite2 = Sprite.from(texture2)
    sprite1.anchor.set(0.5, 0.5)
    sprite2.anchor.set(0.5, 0.5)

    const mask1 = new Graphics()
    mask1.moveTo(-sprite1.width / 2, -sprite1.height / 2)
    mask1.lineTo(-sprite1.width / 2 + sprite1.width * 0.8, -sprite1.height / 2)
    mask1.lineTo(-sprite1.width / 2 + sprite1.width * 0.2, sprite1.height / 2)
    mask1.lineTo(-sprite1.width / 2, sprite1.height / 2)
    mask1.closePath()
    mask1.fill({ color: 0x000000, alpha: 1 })
    sprite1.mask = mask1
    sprite1.addChild(mask1)

    const mask2 = new Graphics()
    mask2.moveTo(-sprite1.width / 2 + sprite1.width * 0.8, -sprite1.height / 2)
    mask2.lineTo(sprite2.width / 2, -sprite2.height / 2)
    mask2.lineTo(sprite2.width / 2, sprite2.height / 2)
    mask2.lineTo(-sprite2.width / 2 + sprite1.width * 0.2, sprite2.height / 2)
    mask2.closePath()
    mask2.fill({ color: 0x000000, alpha: 1 })
    sprite2.mask = mask2
    sprite2.addChild(mask2)

    this.addChild(sprite1)
    this.addChild(sprite2)

    if (!this.tag) {
      return
    }

    const textStyle = new TextStyle({
      dropShadow: {
        alpha: 0.6,
        color: '#000000',
        blur: 8,
        angle: Math.PI / 6,
        distance: 2,
      },
      fill: '#ffffff',
      stroke: { color: '#000000', width: 4, join: 'round' },
      fontSize: 28,
      fontWeight: 'lighter',
    })

    const text = new Text({
      text: this.tag,
      style: textStyle,
    })
    text.anchor.set(0.5, -0.3)
    this.addChild(text)
  }
}
