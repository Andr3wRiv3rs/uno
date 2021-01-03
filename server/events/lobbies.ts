import {
  insertLobby, 
} from "../store"
import {
  WebsocketEvent, 
} from "../utils"
import * as constraints from '../../common/constraints'
import {
  Lobby, 
} from "../../@types"

export const createLobby: WebsocketEvent = {
  regex: /^create-lobby$/,

  callback ({ peer, message, throwError }) {
    const lobby = message as Lobby

    if (!lobby?.name || !constraints.name(lobby.name)) return throwError('Invalid name. Must be 1-32 characters long.')
    if (typeof lobby?.isPrivate !== 'boolean') return throwError('Invalid private option. Must be a boolean.')

    insertLobby({
      name: lobby.name,
      isPrivate: lobby.isPrivate,
      host: peer.player,
      players: [
        {
          ...peer.player,
          hand: [],
        },
      ],
      turn: 1,
      discard: [],
      withdraw: [],
      order: 1,
      started: true,
    })
  },
}
