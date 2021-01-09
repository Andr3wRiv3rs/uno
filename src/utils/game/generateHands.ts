import {
  CardObject, 
} from '..'
import {
  Player, 
} from '../../../@types'
import {
  lobbyStore, 
} from '../../store'
import {
  Nametag, 
} from '../nametag'

export const generateHand = (player: Player, playerIndex: number): void => {
  if (lobbyStore.players[player.nickname]) return

  const cards = player.hand.map(card => new CardObject(card))

  lobbyStore.players[player.nickname] = {
    hand: cards,
    player,
    nametag: new Nametag(player.nickname),
    index: playerIndex,
  }
}

export const generateHands = (): void => {
  lobbyStore.current.players.forEach(generateHand)
}
