import {
  Card, 
} from "./Card"
import {
  Player,
  SafePlayer, 
} from "./Player"

export interface LobbyPayload {
  name: string
  private: boolean
}

export interface SafeLobby extends LobbyPayload {
  host: SafePlayer
  players: SafePlayer[]
  turn: number
  discard: Card[]
  order: 1
  started: false
}

export interface Lobby extends SafeLobby {
  withdraw: Card[]
  players: Player[]
}
