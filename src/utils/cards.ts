import {
  Card,
  CardColor,
  CardType, 
} from "../../@types/Card"
import {
  pixi,
} from './canvas'
import colors, {
  red,
  green,
  blue,
  yellow,
} from './colors'
import * as PIXI from 'pixi.js'
import {
  animate,
  EasingFunctions, 
} from "./timing"
import {
  GameObject, gameObjects,
} from './objects'

const getTypeSymbol = (type: CardType): string => {
  switch (type) {
    case 'skip': return '⊘'
    case 'reverse': return '🗘'
    case 'draw-2': return '+2'
    case 'wild': return ''
    case 'wild-draw-4': return '+4'
  }
}

export class CardObject extends GameObject {
  x = 0
  y = 0
  width = 110
  height = 150
  rotation = 0
  type: CardType
  color: CardColor
  container = new PIXI.Container()
  graphics = new PIXI.Graphics()
  flipped = false
  borderWidth = 3
  hover = false
  isHoverable = false

  cancelMove: null | (() => void)
  
  mousedownListener: (event: PIXI.InteractionEvent) => void

  symbol = Symbol()

  text = new PIXI.Text("", {
    fontFamily: 'Arial',
    fontSize: '50px',
    fill: 'white',
    dropShadow: true,
    dropShadowAngle: Math.PI/2,
    dropShadowDistance: 0,
    dropShadowColor: '#000000',
    dropShadowBlur: 5,
    dropShadowAlpha: 0.7,
  })

  constructor (card: Card) {
    super(() => {
      const {
        x,
        y,
        width,
        height,
        rotation,
        type,
        color, 
        container,
        graphics,
        flipped,
        borderWidth,
        text,
      } = this

      graphics.clear()
      
      text.text = ''

      if (flipped) {
        // draw back of card

        graphics.beginFill(colors['special'])
  
        graphics.drawRect(0, 0, width, height)

        text.style.fontSize = '35px'

        text.text = 'UNO'
      } else {
        // draw front of card

        graphics.beginFill(colors[color])
        graphics.drawRect(0, 0, width, height)

        text.style.fontSize = '50px'

        if (this.color === 'special') {
          graphics.beginFill(red)
          graphics.drawRect(0, 0, width / 2, height / 2)

          graphics.beginFill(green)
          graphics.drawRect(width / 2, 0, width / 2, height / 2)

          graphics.beginFill(blue)
          graphics.drawRect(0, height / 2, width / 2, height / 2)

          graphics.beginFill(yellow)
          graphics.drawRect(width / 2, height / 2, width / 2, height / 2)

        }

        if (typeof type === 'number') {
          text.text = String(type)
        } else {
          text.text = getTypeSymbol(type)
        }
      }

      // draw border

      graphics.beginFill(0xffffff)
      graphics.drawRect(borderWidth, 0, width - (borderWidth * 2), borderWidth)
      graphics.drawRect(0, 0, borderWidth, height)
      graphics.drawRect(width - borderWidth, 0, borderWidth, height)
      graphics.drawRect(borderWidth, height - borderWidth, width - (borderWidth * 2), borderWidth)

      container.position.set(x, y)
      container.rotation = rotation * Math.PI
    }, () => {
      container.destroy()
    })

    const {
      container,
      graphics,
      text,
      width,
      height,
    } = this

    // set pivot point for rotations
    
    container.pivot.x = width / 2
    container.pivot.y = height / 2

    // center text

    text.anchor.set(0.5)
    text.position.set(width / 2, height / 2)

    container.addChild(graphics)
    container.addChild(text)
    pixi.stage.addChild(container)

    graphics.interactive = true

    graphics.addListener('mouseover', () => this.hover = this.isHoverable && true)
    graphics.addListener('mouseout', () => this.hover = false)

    this.type = card.type
    this.color = card.color

    this.update()

    requestAnimationFrame(() => {
      if (this.cancelMove) this.cancelMove()
    })
  }

  async flip (): Promise<void> {
    await animate(250, t => {
      this.container.scale.set(1 - EasingFunctions.easeOutQuad(t), 1)

      this.update()
    })

    this.flipped = !this.flipped

    await animate(250, t => {
      this.container.scale.set(EasingFunctions.easeInQuad(t), 1)

      this.update()
    })
  }

  async rotate (rotation: number): Promise<void> {
    const start = this.rotation
    const end = rotation

    const motion = Math.round(((end - start + 1) % 2 - 1) * 100) / 100

    await animate(500, t => {
      this.rotation = start + (motion * EasingFunctions.easeOutQuad(t))

      this.update()
    })
  }

  async moveTo (x: number, y: number): Promise<void> {
    const startX = this.x
    const startY = this.y
    const xDistance = x - this.x
    const yDistance = y - this.y

    if (this.cancelMove) this.cancelMove()

    await animate(500, (t, cancel) => {
      this.x = startX + (xDistance * EasingFunctions.easeOutQuad(t))
      this.y = startY + (yDistance * EasingFunctions.easeOutQuad(t))

      this.cancelMove = cancel

      this.update()
    })

    this.x = x
    this.y = y

    this.update()
  }
}

setInterval(() => {
  const isHoveringOverCard = (gameObjects as CardObject[]).filter(({ hover }) => hover).length > 0

  pixi.view.style.cursor = isHoveringOverCard ? 'pointer' : 'default'
}, 1000 / 60)
