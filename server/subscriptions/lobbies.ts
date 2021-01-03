import {
  WebsocketSubscription, 
} from "@utils"
import {
  broadcastTo, 
} from "../websockets"
import {
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
    peer.sendEvent<SafeLobby[]>('insert-lobbies', lobbies)
  },
} 

// TODO: make lobbies safe

lobbyEmitter.on('insert-lobbies', (lobby: SafeLobby) => {
  const peers = Lobbies.subscriptions.map(({ peer }) => peer)

  broadcastTo<SafeLobby[]>(peers, 'insert-lobbies', [lobby])
})

lobbyEmitter.on('remove-lobby', (name: string) => {
  const peers = Lobbies.subscriptions.map(({ peer }) => peer)

  broadcastTo<string>(peers, 'remove-lobby', name)
})
