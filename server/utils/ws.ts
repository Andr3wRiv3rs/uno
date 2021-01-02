import WebSocket from 'ws'
import {
  WebsocketMessage,
} from '../../@types'
import {
  WebsocketClient, 
} from '../../common/ws'
import {
  IncomingMessage, 
} from 'http'
export * from '../../common/ws'

export class WebsocketPeer extends WebsocketClient {
  constructor (websocket: WebSocket) {
    super()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.connection = websocket
  }
}

export interface WebsocketEvent {
  regex: RegExp

  callback (props: {
    peer: WebsocketPeer
    message: WebsocketMessage
    throwError(message: string): void
  }): void
}

export type WebsocketSubscription <T extends WebsocketMessage> = {
  subscriptions: {
    peer: WebsocketPeer
    payload?: T
  }[]

  regex: RegExp
  onSubscribe? (peer: WebsocketPeer, payload?: unknown): Promise<void> | void 
  onUnsubscribe? (peer: WebsocketPeer): Promise<void> | void 
}

export class WebsocketServer {
  server: WebSocket.Server

  constructor (config: WebSocket.ServerOptions) {
    this.server = new WebSocket.Server(config)
  }

  onError (callback: (event?: WebSocket.ErrorEvent) => void): void {
    this.server.on('error', callback)
  }

  onConnection (callback: (websocket?: WebsocketPeer, request?: IncomingMessage) => void): void {
    this.server.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      callback(new WebsocketPeer(ws), request)
    })
  }
}
