import * as PIXI from 'pixi.js'
import {
  GameObject,
} from './objects'
import {
  pixi,
} from './canvas'

export class Nametag extends GameObject {
  x: number
  y: number
  rotation = 0
  content = ""
  graphics = new PIXI.Graphics
  container = new PIXI.Container()
  active = false

  text = new PIXI.Text("", {
    fontFamily: 'Arial',
    fontSize: '20px',
    fill: 'white',
    dropShadow: true,
    dropShadowAngle: Math.PI/2,
    dropShadowDistance: 0,
    dropShadowColor: '#000000',
    dropShadowBlur: 5,
    dropShadowAlpha: 0.7,
  })

  constructor (content: string) {
    super(() => {
      const {
        x,
        y,
        rotation,
        graphics,
        text,
        content,
        active,
      } = this

      graphics.clear()
      
      text.text = content

      if (active) {
        text.style.fill = 0x000000

        const {
          width,
          height,
        } = text

        const padding = 10

        graphics.beginFill(0xffffff)
        graphics.drawRect(width / -2 - padding, height / -2 - padding, width + (padding * 2), height + (padding * 2))
      } else {
        text.style.fill = 0xffffff
      }

      container.position.set(x, y)
      container.rotation = rotation * Math.PI
    }, () => {
      container.destroy()
    })

    const {
      container,
      graphics,
      text,
    } = this

    // center text
    text.anchor.set(0.5)

    this.content = content

    container.addChild(graphics)
    container.addChild(text)
    pixi.stage.addChild(container)

    this.update()
  }
}
