export interface MessageEventOptions {
  once?: boolean
}

export interface SendMessageOptions {
  persistent?: boolean
}

export interface WebsocketEvent {
  eventName: string
  handler: (event?: Event) => void
  symbol: symbol
}

export interface WebsocketSubscriptionPayload {
  name: string
  payload?: WebsocketMessage
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type WebsocketMessage = string | object | number | boolean | WebsocketMessage[]
