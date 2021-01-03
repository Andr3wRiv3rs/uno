import {
  getSafeLobby,
  WebsocketSubscription, 
} from "../utils"
import {
  broadcastTo, 
} from "../websockets"
import {
  Lobby,
  SafeLobby, 
} from "../../@types/Lobby"
import {
  lobbies,
  lobbyEmitter,
} from '../store'

export const Lobbies: WebsocketSubscription<undefined> = {
  regex: /^lobbies$/,
  subscriptions: [],

  onSubscribe (peer) {
    peer.sendEvent<SafeLobby[]>('set-lobbies', lobbies.map(getSafeLobby))
  },
} 

const peers = () => Lobbies.subscriptions.map(({ peer }) => peer)

lobbyEmitter.on('insert-lobby', (lobby: Lobby) => {
  broadcastTo<SafeLobby>(peers(), 'insert-lobby', getSafeLobby(lobby))
})

lobbyEmitter.on('remove-lobby', (name: string) => {
  broadcastTo<string>(peers(), 'remove-lobby', name)
})

lobbyEmitter.on('lobby-update', (lobby: Lobby, payload: Record<string, unknown>) => {
  broadcastTo<{
    lobby: SafeLobby
    payload: Record<string, unknown>
  }>(peers(), 'lobby-update', {
    lobby: getSafeLobby(lobby),
    payload,
  })
})

lobbyEmitter.on('player-update', (lobby: Lobby, nickname: string, payload: Record<string, unknown>) => {
  broadcastTo<{
    lobby: SafeLobby
    nickname: string
    payload: Record<string, unknown>
  }>(peers(), 'player-update', {
    lobby: getSafeLobby(lobby),
    nickname,
    payload,
  })
})
