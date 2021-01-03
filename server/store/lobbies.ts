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

export const updateLobby = (lobby: Lobby, payload: Record<string, unknown>): void => {
  Object.assign(lobby, payload)
  lobbyEmitter.emit('lobby-update', lobby, payload)
}

export const updatePlayer = (lobby: Lobby, nickname: string, payload: Record<string, unknown>): void => {
  Object.assign(lobby.players.find(player => player.nickname === nickname), payload)
  lobbyEmitter.emit('player-update', lobby, nickname, payload)
}
