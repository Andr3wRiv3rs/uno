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
import {
  Card, 
} from "../../@types"

// TODO: fix inconsistent naming wiith lobbies/room

export const Room: WebsocketSubscription<string> = {
  regex: /^lobbies$/,
  subscriptions: [],

  onSubscribe (peer) {
    peer.sendEvent<SafeLobby[]>('set-lobbies', lobbies.map(getSafeLobby))
  },
} 

const peers = (lobby: Lobby) => Room.subscriptions
  .filter(({ payload: lobbyName }) => lobbyName === lobby.name)
  .map(({ peer }) => peer)

lobbyEmitter.on('play-card', (lobby: Lobby, nickname: string, cardIndex: number) => {
  broadcastTo(peers(lobby), 'play-card', {
    nickname,
    cardIndex,
  })
})

lobbyEmitter.on('draw-card', (lobby: Lobby, nickname: string, card: Card) => {
  broadcastTo(peers(lobby), 'play-card', {
    nickname,
    card,
  })
})

lobbyEmitter.on('turn-end', (lobby: Lobby) => {
  broadcastTo(peers(lobby), 'turn-end')
})
