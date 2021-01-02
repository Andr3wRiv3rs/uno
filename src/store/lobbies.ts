import {
  makeAutoObservable,
} from 'mobx'
import {
  Lobby, WebsocketSubscriptionPayload, 
} from '../../@types'
import {
  ws, 
} from '../utils'

class Lobbies {
  list: Lobby[] = []

  constructor () {
    makeAutoObservable(this)
  }

  insert (lobby: Lobby): void {
    this.list.push(lobby)
  }

  remove (name: string): void {
    this.list.splice(this.list.findIndex(lobby => lobby.name === name), 1)
  }

  create (lobby: Lobby) {
    ws.sendEvent<Lobby>('create-lobby', lobby)
  }
}

export const lobbies = new Lobbies()

ws.sendEvent<WebsocketSubscriptionPayload>('subscribe', {
  name: 'lobbies',
}, {
  persistent: true,
})

ws.onEvent<Lobby>('insert-lobby', lobbies.insert)
ws.onEvent<string>('remove-lobby', lobbies.remove)
