import {
  Card, 
} from "./Card"
import {
  Player,
  SafePlayer, 
} from "./Player"

export interface LobbyPayload {
  name: string
  isPrivate: boolean
}

export interface SafeLobby extends LobbyPayload {
  host: SafePlayer
  players: SafePlayer[]
  turn: number
  discard: Card[]
  order: -1 | 1
  started: boolean
  chat: []
}

export interface Lobby extends SafeLobby {
  draw: Card[]
  players: Player[]
}
