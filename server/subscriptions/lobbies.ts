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
    peer.sendEvent<SafeLobby[]>('insert-lobbies', lobbies.map(getSafeLobby))
  },
} 

lobbyEmitter.on('insert-lobbies', (lobbies: Lobby[]) => {
  const peers = Lobbies.subscriptions.map(({ peer }) => peer)

  broadcastTo<SafeLobby[]>(peers, 'insert-lobbies', lobbies.map(getSafeLobby))
})

lobbyEmitter.on('remove-lobby', (name: string) => {
  const peers = Lobbies.subscriptions.map(({ peer }) => peer)

  broadcastTo<string>(peers, 'remove-lobby', name)
})
