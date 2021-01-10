import {
  MessageEventOptions,
  SendMessageOptions,
  WebsocketEvent,
  WebsocketMessage,
} from "../@types"

const times: number[] = [5, 10, 30, 60]

export class WebsocketClient {
  connection!: WebSocket
  private readonly ws
  private sendQueue: WebsocketMessage[] = []
  private persistentSendQueue: WebsocketMessage[] = []
  private persistentEventQueue: WebsocketEvent[] = []
  private connectionAttempts = 0

  constructor (url?: string, ws?: unknown) {
    if (url) {
      this.ws = ws

      this.connect(url)
    }
  }

  connect (url: string, fromClose = false): void {
    if (this.connection && this.connection.readyState === 1) this.connection.close()

    this.connection = new (this.ws as new (url: string, protocols?: string | string[]) => WebSocket || WebSocket)(url)

    this.connectionAttempts += 1

    const closeHandler = () => {
      console.error('Connection closed. Attempting to reconnect..')

      this.connect(url, true)
    }

    const openHandler = () => {
      this.connectionAttempts = 0
      this.processQueues()
    }

    const seconds = times[Math.min(Math.floor(this.connectionAttempts / 10), times.length - 1)]
    
    if (fromClose) setTimeout(() => {
      if (this.connection.readyState !== 1) {
        this.connection.removeEventListener('open', openHandler)
        this.connect(url)
      }
    }, 1000 * seconds)

    this.connection.addEventListener('close', closeHandler)
    this.connection.addEventListener('open', openHandler)
  }

  processQueues (): void {
    for (const message of this.sendQueue) {
      this.send(message)
    }

    this.sendQueue = []

    for (const message of this.persistentSendQueue) {
      this.send(message)
    }

    for (const { eventName, handler } of this.persistentEventQueue) {
      this.connection.addEventListener(eventName, handler)
      if (eventName === 'open') handler()
    }
  }

  queueEvent (eventName: string, handler: (event?: Event) => void): () => void {
    const event: WebsocketEvent = {
      eventName,
      symbol: Symbol(),
      handler,
    }

    this.persistentEventQueue.push(event)

    if (this.connection.readyState === 1) {
      this.connection.addEventListener(eventName, handler)
    }

    return () => {
      this.removeEvent(event)
    }
  }

  removeEvent (event: WebsocketEvent): void {
    const index = this.persistentEventQueue.findIndex(({ symbol }) => {
      return symbol === event.symbol
    })

    this.persistentEventQueue.splice(index, 1)
    this.connection.removeEventListener(event.eventName, event.handler)
  }

  onOpen (callback: (openEvent?: Event) => void): void {
    this.queueEvent('open', callback)
  }

  onError (callback: (errorEvent?: Event) => void): void {
    this.queueEvent('error', callback)
  }

  onClose (callback: (closeEvent?: Event) => void): void {
    this.queueEvent('close', callback)
  }

  onMessage (
    callback: (message: WebsocketMessage) => void,
    options: MessageEventOptions = {},
  ): () => void {
    const removeEvent = this.queueEvent('message', (messageEvent?: Event) => {
      const parsedMessage = JSON.parse((messageEvent as unknown as { data: string }).data)

      callback(parsedMessage as WebsocketMessage)

      if (options.once) removeEvent()
    })

    return removeEvent
  }

  onEvent <T extends WebsocketMessage> (
    eventName: string,
    callback: (message?: T) => void, 
    options: MessageEventOptions = {},
  ): () => void {
    const { once, ...restOptions } = options

    const removeEvent = this.onMessage((parsedMessage: WebsocketMessage) => {
      const response = parsedMessage as {
        eventName: string
        message: T
      }

      if (response.eventName === eventName) {
        callback(response.message)

        if (once) removeEvent()
      }
    }, restOptions)

    return removeEvent
  }

  send (message: WebsocketMessage, options: SendMessageOptions = {}): void {
    if (options.persistent) this.persistentSendQueue.push(message)

    if (this.connection.readyState === 1) this.connection.send(JSON.stringify(message))
    else if (!options.persistent) this.sendQueue.push(message)
  }

  sendEvent <T extends WebsocketMessage> (eventName: string, message?: T, options?: SendMessageOptions): void {
    this.send({
      eventName,
      message,
    }, options)
  }
}
