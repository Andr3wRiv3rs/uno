import {
  makeAutoObservable,
} from 'mobx'
import {
  LobbyPayload,
  SafeLobby,
  WebsocketSubscriptionPayload, 
} from '../../@types'
import {
  api,
  ws, 
} from '../utils'
import {
  AxiosResponse,
} from 'axios'

class LobbyStore {
  list: SafeLobby[] = []

  constructor () {
    makeAutoObservable(this)
  }

  insert (lobbies: SafeLobby[]): void {
    lobbyStore.list.push(...lobbies)
  }

  remove (name: string): void {
    lobbyStore.list.splice(this.list.findIndex(lobby => lobby.name === name), 1)
  }

  async create (lobby: LobbyPayload): Promise<AxiosResponse<SafeLobby>> {
    return await api.post<SafeLobby>('/lobbies/create', lobby).catch(r => r)
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
