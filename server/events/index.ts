import {
  WebsocketEvent,
} from '../utils/index'
import {
  subscribe,
  unsubscribe,
} from './subscriptions'
import {
  chooseColorEvent, 
} from './chooseColor'
import {
  drawCardEvent, 
} from './drawCard'
import {
  playCardEvent, 
} from './playCard'
import {
  joinLobbyEvent, 
} from './joinLobby'

export const events: WebsocketEvent[] = [
  subscribe,
  unsubscribe,
  chooseColorEvent,
  drawCardEvent,
  playCardEvent,
  joinLobbyEvent,
]
