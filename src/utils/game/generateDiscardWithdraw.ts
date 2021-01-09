import {
  lobbyStore, 
} from "../../store"
import {
  CardObject, 
} from "../cards"

export const generateDiscardDrawPiles = (): void => {
  if (lobbyStore.discard) lobbyStore.discard.destroy()

  // TODO: make universal "disabled" style
  lobbyStore.draw.flipped = true
  lobbyStore.draw.container.alpha = 0.4

  console.log(lobbyStore.current.discard.slice(-1)[0].color)

  lobbyStore.discard = new CardObject(lobbyStore.current.discard.slice(-1)[0])
}
