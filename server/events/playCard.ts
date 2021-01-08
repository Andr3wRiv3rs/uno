import {
  lobbies,
  playCard, 
} from "../store"
import {
  WebsocketEvent, 
} from "../utils"

export const playCardEvent: WebsocketEvent = {
  regex: /^play-card$/,

  callback ({ peer, message, throwError }) {
    const {
      cardIndex,
      lobbyName,
    } = message as {
      cardIndex: number
      lobbyName: string
    }

    if (!peer.player.nickname) return throwError('Unauthorized')

    const lobby = lobbies.find(({ name }) => lobbyName === name)

    if (!lobby) return throwError('Lobby not found')

    try {
      playCard(lobby, peer.player.nickname, cardIndex)
    } catch (error) {
      throwError(error)
    }
  },
}
