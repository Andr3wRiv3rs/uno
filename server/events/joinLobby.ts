import {
  insertPlayer,
  lobbies,
} from "../store"
import {
  WebsocketEvent, 
} from "../utils"

export const joinLobbyEvent: WebsocketEvent = {
  regex: /^join-lobby$/,

  callback ({ peer, message, throwError }) {
    const {
      lobbyName,
    } = message as {
      lobbyName: string
    }

    if (!peer.player.nickname) return throwError('Unauthorized')

    const lobby = lobbies.find(({ name }) => lobbyName === name)

    if (!lobby) return throwError('Lobby not found')

    if (lobby.players.length === 4) return throwError('Room capacity reached')

    try {
      insertPlayer(lobby, peer.player.nickname)
    } catch (error) {
      throwError(error)
    }
  },
}
