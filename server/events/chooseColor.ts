import {
  CardColor, 
} from "../../@types"
import {
  chooseColor,
  lobbies, 
} from "../store"
import {
  WebsocketEvent, 
} from "../utils"

export const chooseColorEvent: WebsocketEvent = {
  regex: /^choose-color$/,

  callback ({ peer, message, throwError }) {
    const {
      lobbyName,
      color,
    } = message as {
      lobbyName: string
      color: CardColor
    }

    if (!peer.player.nickname) return throwError('Unauthorized')

    const lobby = lobbies.find(({ name }) => lobbyName === name)

    if (!lobby) return throwError('Lobby not found')

    try {
      chooseColor(lobby, peer.player.nickname, color)
    } catch (error) {
      throwError(error)
    }
  },
}
