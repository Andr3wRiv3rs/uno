import {
  drawCard,
  lobbies, 
} from "../store"
import {
  WebsocketEvent, 
} from "../utils"

export const drawCardEvent: WebsocketEvent = {
  regex: /^draw-card$/,

  callback ({ peer, message, throwError }) {
    const {
      lobbyName,
    } = message as {
      lobbyName: string
    }

    if (!peer.player.nickname) return throwError('Unauthorized')

    const lobby = lobbies.find(({ name }) => lobbyName === name)

    if (!lobby) return throwError('Lobby not found')

    try {
      drawCard(lobby, peer.player.nickname, false)
    } catch (error) {
      throwError(error)
    }
  },
}
