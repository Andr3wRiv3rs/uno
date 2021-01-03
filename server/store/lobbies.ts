import {
  Lobby, 
} from "../../@types"
import {
  EventEmitter, 
} from "events"

export const lobbyEmitter = new EventEmitter()

export const lobbies: Lobby[] = []

export const insertLobby = (lobby: Lobby): void => {
  lobbies.push(lobby)
  lobbyEmitter.emit('insert-lobbies', [lobby])
}
