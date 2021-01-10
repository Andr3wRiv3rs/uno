import {
  authStore, lobbyStore, 
} from "../../store"
import {
  ws, 
} from "../ws"
import {
  alignHands, 
} from "./align"

const isInGame = () => Boolean(lobbyStore.players[authStore.nickname])

export const testMatchingCards = (): void => {
  const isMyTurn = isInGame() && lobbyStore.current.turn === lobbyStore.players[authStore.nickname].index

  let hasPlayableCard = false

  if (isInGame()) lobbyStore.players[authStore.nickname].hand.forEach((card) => {
    const [lastCard] = lobbyStore.current.discard.slice(-1)

    const isSpecialCard = card.color === 'special'
    const isSameType = card.type === lastCard.type
    const isSameColor = card.color === lastCard.color || (lastCard.color === 'special' && lobbyStore.current.currentColor === card.color) 

    if (isMyTurn && (isSpecialCard || isSameColor || isSameType)) {
      card.container.alpha = 1
      card.isHoverable = true

      hasPlayableCard = true

      if (card.mousedownListener) return

      card.mousedownListener = async () => {
        card.moveTo(lobbyStore.discard.x, lobbyStore.discard.y)
        
        const index = lobbyStore.players[authStore.nickname].hand.findIndex(({ symbol }) => symbol === card.symbol)
  
        lobbyStore.playCard(index)

        lobbyStore.players[authStore.nickname].hand.splice(index, 1)
  
        alignHands()
  
        await card.rotate(lobbyStore.discard.rotation)
        lobbyStore.discard.type = card.type
        lobbyStore.discard.color = card.color
  
        lobbyStore.discard.update()
        card.destroy()

        testMatchingCards()
      }
  
      card.graphics.addListener('mousedown', card.mousedownListener)
    } else {
      card.container.alpha = 0.4
      card.isHoverable = false
      card.graphics.removeListener('mousedown', card.mousedownListener)
      card.mousedownListener = null
    }
  })

  if (!hasPlayableCard && isMyTurn && !lobbyStore.current.awaitingChoice) {
    lobbyStore.draw.container.alpha = 1
    lobbyStore.draw.isHoverable = true

    if (lobbyStore.draw.mousedownListener) return

    lobbyStore.draw.mousedownListener = () => lobbyStore.drawCard()

    lobbyStore.draw.graphics.addListener('mousedown', lobbyStore.draw.mousedownListener)
  } else {
    lobbyStore.draw.container.alpha = 0.4
    lobbyStore.draw.isHoverable = false

    if (lobbyStore.draw.mousedownListener) {
      lobbyStore.draw.graphics.removeListener('mousedown', lobbyStore.draw.mousedownListener)
    }

    lobbyStore.draw.mousedownListener = null
  }
}
