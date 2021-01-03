import {
  WebsocketEvent,
} from '../utils'
import {
  subscribe,
  unsubscribe,
} from './subscriptions'
import {
  createLobby,
} from './lobbies'

export const events: WebsocketEvent[] = [
  subscribe,
  unsubscribe,
  createLobby,
]
