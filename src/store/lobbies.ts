import {
  makeAutoObservable,
} from 'mobx'
import {
  LobbyPayload,
  WebsocketSubscriptionPayload, 
} from '../../@types'
import {
  ws, 
} from '../utils'

class LobbyStore {
  list: LobbyPayload[] = []

  constructor () {
    makeAutoObservable(this)
  }

  insert (lobbies: LobbyPayload[]): void {
    lobbyStore.list.push(...lobbies)
  }

  remove (name: string): void {
    lobbyStore.list.splice(this.list.findIndex(lobby => lobby.name === name), 1)
  }

  create (lobby: LobbyPayload) {
    ws.sendEvent<LobbyPayload>('create-lobby', lobby)
  }
}

export const lobbyStore = new LobbyStore()

ws.sendEvent<WebsocketSubscriptionPayload>('subscribe', {
  name: 'lobbies',
}, {
  persistent: true,
})

ws.onEvent<LobbyPayload[]>('insert-lobbies', lobbyStore.insert)
ws.onEvent<string>('remove-lobby', lobbyStore.remove)
