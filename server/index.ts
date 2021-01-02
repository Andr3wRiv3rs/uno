import {
  WebsocketMessage,
  MessageEventOptions,
} from '../@types'
import {
  WebsocketServer,
  WebsocketPeer,
  wsLogTag,
} from './utils'
import {
  events, 
} from './events'

export const broadcastTo = <T extends WebsocketMessage> (peers: WebsocketPeer[], event: string, message?: T): void => {
  for (const peer of peers) {
    peer.sendEvent(event, message)
  }
}

export const listenTo = (
  peers: WebsocketPeer[], 
  event: string, 
  callback: (message?: WebsocketMessage) => void,
  options: MessageEventOptions,
): void => {
  for (const peer of peers) {
    peer.onEvent(event, callback, options)
  }
}

export const server = new WebsocketServer({
  port: 3000,
})

server.onConnection((peer: WebsocketPeer | undefined) => {
  if (peer === undefined) return

  const throwError = (message: string): void => {
    peer.sendEvent('error', message)
  }

  // use fewer listeners for performance by testing all events under onMessage
  peer.onMessage((message) => {
    const response = message as {
      eventName: string
      message: WebsocketMessage
    }

    console.log(wsLogTag, message)
  
    if (response.eventName) for (const { regex, callback } of events) {
      try {
        if (regex.test(response.eventName)) callback({
          message: response.message || {},
          peer,
          throwError,
        })
      } catch (error) {
        throwError('Internal server error.')

        console.error(error)
      }
    }
  })
})

console.log(wsLogTag, 'Server running.')

export default server
