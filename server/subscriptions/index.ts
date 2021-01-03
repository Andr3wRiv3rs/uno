import {
  WebsocketSubscription, 
} from "utils"
import {
  WebsocketMessage, 
} from "../../@types"
import {
  Lobbies,
} from './lobbies'

export const subscriptions: WebsocketSubscription<WebsocketMessage>[] = [
  Lobbies,
]
