import {
  WebsocketClient,
} from '../../common/ws'

export let ws: WebsocketClient

if (typeof window !== 'undefined') {
  ws = new WebsocketClient(`ws://localhost:8000/ws`)

  ws.onOpen(() => console.log('Established WebSocket connection.'))
  
  ws.onError(console.error)
  ws.onEvent('error', console.error)
  
  ws.onMessage(console.log)
  
  window['ws'] = ws
}
