import {
  WebsocketClient,
} from '../../common/ws'

export const ws = new WebsocketClient(`ws://localhost:3000`)

ws.onOpen(() => console.log('Established WebSocket connection.'))

ws.onError(console.error)
ws.onEvent('error', console.error)

ws.onMessage(console.log)

window['ws'] = ws
