import { Assets, Container, Sprite, Text, TextStyle } from 'pixi.js'

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
