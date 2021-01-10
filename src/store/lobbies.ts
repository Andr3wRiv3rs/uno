import {
  configure,
  makeAutoObservable,
} from 'mobx'
import {
  CardColor,
  LobbyPayload,
  Player,
  SafeLobby,
  WebsocketSubscriptionPayload, 
} from '../../@types'
import {
  api,
  CardObject,
  Nametag,
  ws, 
} from '../utils/index'
import {
  AxiosResponse,
} from 'axios'

configure({
  enforceActions: 'never',
})

class LobbyStore {
  list: SafeLobby[] = []
  current: SafeLobby

  players: Record<string, {
    player: Player
    hand: CardObject[]
    index: number
    nametag: Nametag
  }> = {}

  discard: CardObject = null
  
  draw: CardObject = new CardObject({
    type: 0,
    color: 'red',
  })

  constructor () {
    makeAutoObservable(this)
  }

  set (lobbies: SafeLobby[]): void {
    lobbyStore.list = lobbies
  }

  insert (lobby: SafeLobby): void {
    const existingLobby = lobbyStore.list.find(({ name }) => lobby.name === name)
    
    if (existingLobby) Object.assign(existingLobby, lobby)
    else lobbyStore.list.push(lobby)
  }

  remove (name: string): void {
    lobbyStore.list.splice(lobbyStore.list.findIndex(lobby => lobby.name === name), 1)
  }

  update (props: {
    lobby: SafeLobby
    payload: Record<string, unknown>
  }): void {
    // Object.assign(lobbyStore.list.find(({ name }) => name === props.lobby.name), props.payload)
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

  join (): void {
    ws.sendEvent<{
      lobbyName: string
    }>('join-lobby', {
      lobbyName: this.current.name,
    })
  }

  // TODO: switch to separate store
  // TODO: return and handle errors for invalid rooms

  subscribeToRoom (lobby: SafeLobby): void {
    ws.sendEvent('subscribe', {
      name: 'room',
      payload: lobby.name,
    }, {
      persistent: true,
    })

    this.current = this.list.find(({ name }) => name === lobby.name)
  }

  playCard (cardIndex: number): void {
    ws.sendEvent<{
      lobbyName: string
      cardIndex: number
    }>('play-card', {
      lobbyName: this.current.name,
      cardIndex,
    })
  }

  drawCard (): void {
    ws.sendEvent<{
      lobbyName: string
    }>('draw-card', {
      lobbyName: this.current.name,
    })
  }

  chooseColor (color: CardColor): void {
    ws.sendEvent<{
      lobbyName: string
      color: CardColor
    }>('choose-color', {
      lobbyName: this.current.name,
      color,
    })

    this.discard.color = color
    this.discard.update()
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
