import {
  WebsocketClient,
} from '../../common/ws'

export let ws: WebsocketClient

if (typeof window !== 'undefined') {
  ws = new WebsocketClient(
    process.env.NODE_ENV === 'development' 
      ? `ws://localhost:8000/ws`
      : `${window.location.protocol.includes('https') ? 'wss' : 'ws'}://${window.location.host}/ws`)

  ws.onOpen(() => console.log('Established WebSocket connection.'))
  
  ws.onError(console.error)
  ws.onEvent('error', console.error)
  
  ws.onMessage(console.log)
  
  window['ws'] = ws
}
