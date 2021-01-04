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

for (const { update } of gameObjects) update()
