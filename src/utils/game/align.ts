import {
  CardObject, pixi, 
} from ".."
import {
  authStore, lobbyStore, 
} from "../../store"
import {
  Nametag, 
} from "../nametag"

// TODO: unify isInGame
const isInGame = () => Boolean(lobbyStore.players[authStore.nickname])

const margin = 5

export const alignCardToHand = (card: CardObject, length: number, playerIndex: number, cardIndex: number): void => {
  const { clientWidth: width, clientHeight: height } = pixi.view.parentElement

  card.flipped = true

  switch (playerIndex) {
    case 0: {
      if (isInGame()) {
        const offset = (width / 2) - ((length - 1) / 2 * (card.width + margin))

        card.flipped = false
  
        // card.y = height - (card.height / 2) - margin
        // card.x = offset + ((card.width + margin) * cardIndex)
        card.moveTo(offset + ((card.width + margin) * cardIndex), height - (card.height / 2) - margin)
      } else {
        const offset = (width / 2) - ((length - 1) / 2 * (card.width / 2 + margin))
  
        card.y = height
        card.x = offset + ((card.width / 2 + margin) * cardIndex)
      }

      break
    }

    case 1: {
      const offset = (height / 2) - ((length - 1) / 2 * (card.width / 2 + margin))

      card.rotation = 0.5

      card.y = offset + ((card.width / 2 + margin) * cardIndex)
      card.x = 0

      break
    }

    case 2: {
      const offset = (width / 2) - ((length - 1) / 2 * (card.width / 2 + margin))

      card.rotation = 1

      card.y = 0
      card.x = offset + ((card.width / 2 + margin) * cardIndex)

      break
    }

    case 3: {
      const offset = (height / 2) - ((length - 1) / 2 * (card.width / 2 + margin))

      card.rotation = 1.5

      card.y = offset + ((card.width / 2 + margin) * cardIndex)
      card.x = width

      break
    }
  }

  card.update()
}

export const alignNametag = (nametag: Nametag, playerIndex: number, referenceCard: CardObject): void => {
  if (!referenceCard) return

  const { clientWidth: width, clientHeight: height } = pixi.view.parentElement

  switch (playerIndex) {
    case 0:
      nametag.y = height - (referenceCard.height + margin + 45)
      nametag.x = width / 2
      nametag.rotation = 0
      nametag.update()
      break

    case 1:
      nametag.y = height / 2
      nametag.x = referenceCard.width / 2 + margin + 65
      nametag.rotation = 0.5
      nametag.update()
      break

    case 2:
      nametag.y = referenceCard.height / 2 + margin + 45
      nametag.x = pixi.view.width / 2
      nametag.rotation = 1
      nametag.update()
      break

    case 3:
      nametag.y = height / 2
      nametag.x = width - (referenceCard.width / 2 + margin + 65)
      nametag.rotation = 0.5
      nametag.update()
      break
  }
}

export const alignHands = (): void => {
  const values = Object.values(lobbyStore.players)

  if (isInGame()) {
    while (values[0].player.nickname !== authStore.nickname) {
      values.push(values.shift())
    }
  }

  values.forEach(({ hand, nametag }, playerIndex) => {
    hand.forEach((card, cardIndex) => {
      alignCardToHand(card, hand.length, playerIndex, cardIndex)
    })

    alignNametag(nametag, playerIndex, hand[0])
  })
}

export const alignDiscardDrawPiles = (): void => {
  if (!lobbyStore.discard) return

  const { clientWidth: width, clientHeight: height } = pixi.view.parentElement

  lobbyStore.discard.x = width / 2
  lobbyStore.discard.y = height / 2

  lobbyStore.draw.y = lobbyStore.discard.y
  lobbyStore.draw.x = lobbyStore.discard.x - lobbyStore.draw.width - 20

  lobbyStore.discard.update()
  lobbyStore.draw.update()
}

export const alignAll = (): void => {
  alignHands()
  alignDiscardDrawPiles()
}
