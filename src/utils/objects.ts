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

export const gameObjects: GameObject[] = []

export class GameObject {
  update: () => void

  onDestroy: () => void
  
  destroy (): void {
    gameObjects.splice(gameObjects.indexOf(this), 1)
    if (this.onDestroy) this.onDestroy()
  }

  constructor (update: () => void, onDestroy?: () => void) {
    this.update = update

    this.onDestroy = onDestroy

    gameObjects.push(this)
  }
}

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
  x = 150
  y = 150
  width = 110
  height = 150
  rotation = 0
  type: CardType
  color: CardColor
  container = new PIXI.Container()
  graphics = new PIXI.Graphics()
  flipped = false
  borderWidth = 3

  text = new PIXI.Text("", {
    fontFamily: 'Arial',
    fontSize: '50px',
    fill: 'white',
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

        if (typeof type === 'string' && type.includes('wild')) {
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
      graphics.drawRect(0, 0, width, borderWidth)
      graphics.drawRect(0, 0, borderWidth, height)
      graphics.drawRect(width - borderWidth, 0, borderWidth, height)
      graphics.drawRect(0, height - borderWidth, width, borderWidth)

      container.position.set(x, y)
      container.rotation = rotation * Math.PI
    })

    const {
      container,
      graphics,
      text,
      width,
      height,
    } = this
    
    container.pivot.x = width / 2
    container.pivot.y = height / 2

    text.anchor.set(0.5)
    text.position.set(width / 2, height / 2)

    container.addChild(graphics)
    container.addChild(text)
    pixi.stage.addChild(container)

    this.type = card.type
    this.color = card.color
  }

  // flip () {

  // }
}

window['card'] = new CardObject({
  color: 'special',
  type: 'wild-draw-4',
})

for (const { update } of gameObjects) update()
