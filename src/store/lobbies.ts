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

  set (lobbies: SafeLobby[]): void {
    lobbyStore.list = lobbies
  }

  insert (lobby: SafeLobby): void {
    lobbyStore.list.push(lobby)
  }

  remove (name: string): void {
    lobbyStore.list.splice(this.list.findIndex(lobby => lobby.name === name), 1)
  }

  update (props: {
    lobby: SafeLobby
    payload: Record<string, unknown>
  }): void {
    Object.assign(lobbyStore.list.find(({ name }) => name === props.lobby.name), props.payload)
  }

  updatePlayer (props: {
    lobby: SafeLobby
    nickname: string
    payload: Record<string, unknown>
  }): void {
    const player = lobbyStore.list
      .find(({ name }) => name === props.lobby.name)
      .players
      .find(player => player.nickname === props.nickname)

    Object.assign(player, props.payload)
  }

  async create (lobby: LobbyPayload): Promise<AxiosResponse<SafeLobby>> {
    return await api.post<SafeLobby>('/lobbies/create', lobby)
  }
}

export const lobbyStore = new LobbyStore()

ws.sendEvent<WebsocketSubscriptionPayload>('subscribe', {
  name: 'lobbies',
}, {
  persistent: true,
})

ws.onEvent<SafeLobby[]>('set-lobbies', lobbyStore.set)
ws.onEvent<SafeLobby>('insert-lobby', lobbyStore.insert)
ws.onEvent<string>('remove-lobby', lobbyStore.remove)

ws.onEvent<{
  lobby: SafeLobby
  payload: Record<string, unknown>
}>('lobby-update', lobbyStore.update)

ws.onEvent<{
  lobby: SafeLobby
  nickname: string
  payload: Record<string, unknown>
}>('player-update', lobbyStore.updatePlayer)
