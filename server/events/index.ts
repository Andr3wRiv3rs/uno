import {
  WebsocketEvent,
} from '../utils'
import {
  subscribe,
  unsubscribe,
} from './subscriptions'

export const events: WebsocketEvent[] = [
  subscribe,
  unsubscribe,
]
