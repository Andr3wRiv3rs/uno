import {
  WebsocketSubscription, 
} from "utils"
import {
  WebsocketMessage, 
} from "../../@types"
import {
  Lobbies,
} from './lobbies'
import {
  Room, 
} from './room'

export const subscriptions: WebsocketSubscription<WebsocketMessage>[] = [
  Lobbies,
  Room,
]
