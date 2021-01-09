import {
  subscriptions, 
} from '../subscriptions'

import {
  wsLogTag,
  WebsocketEvent, 
  WebsocketSubscription,
} from '../utils/index'
import {
  WebsocketMessage,
  WebsocketSubscriptionPayload, 
} from '../../@types'

export const subscribe: WebsocketEvent = {
  regex: /^subscribe$/,
  
  callback ({ peer, message: rawMessage, throwError }): void {
    const message = rawMessage as unknown as WebsocketSubscriptionPayload
    
    if (typeof message === 'string') return throwError('Invalid subscription.')

    const subscription: WebsocketSubscription<WebsocketMessage> | undefined = subscriptions.find(
      ({ regex }) => {
        return regex.test(message.name)
      },
    )

    if (subscription) {
      subscription.subscriptions.push({
        peer,
        payload: message.payload,
      })

      subscription.onSubscribe?.(peer, message.payload)

      console.log(wsLogTag, `Subscribed peer to ${message.name}.`)

      peer.onClose(() => {
        const index = subscription.subscriptions.indexOf({
          peer,
          payload: message.payload,
        })

        if (index > -1) {
          subscription.subscriptions.splice(index, 1)

          subscription.onUnsubscribe?.(peer)

          console.log(wsLogTag, `Unsubscribed peer from ${message}.`)
        }
      })
    }
  },
}

export const unsubscribe: WebsocketEvent = {
  regex: /^unsubscribe$/,
  
  callback (): void {
    // if (typeof message !== 'string') return

    // const subscription: WebsocketSubscription<WebsocketMessage> = subscriptions.find(
    //   ({ regex }) => {
    //     return regex.test(message as string)
    //   },
    // )

    // TODO: fix unsubscribe

    // if (subscription) {
    // const index = subscription.subscriptions.findIndex(subscription => peer)

    // if (index > -1) {
    //   subscription.peers.splice(index, 1)

    //   subscription.onUnsubscribe?.(peer)

    //   console.log(wsLogTag, `Unsubscribed peer from ${message}.`)
    // }
    // }
  },
}
