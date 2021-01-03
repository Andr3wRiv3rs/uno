import * as PIXI from 'pixi.js'

export const pixi = new PIXI.Application()

export const graphics = new PIXI.Graphics()

pixi.stage.addChild(graphics)
