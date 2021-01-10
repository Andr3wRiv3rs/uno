import {
  WebsocketSubscription, 
} from "../utils"
import {
  broadcastTo, 
} from "../websockets"
import {
  Lobby,
} from "../../@types/Lobby"
import {
  lobbyEmitter,
} from '../store'
import {
  Card, CardColor, Player, 
} from "../../@types"

// TODO: fix inconsistent naming wiith lobbies/room

export const Room: WebsocketSubscription<string> = {
  regex: /^room$/,
  subscriptions: [],
} 

const peers = (lobby: Lobby) => Room.subscriptions
  .filter(({ payload: lobbyName }) => lobbyName === lobby.name)
  .map(({ peer }) => peer)

lobbyEmitter.on('play-card', (lobby: Lobby, nickname: string, cardIndex: number, card: Card) => {
  broadcastTo(peers(lobby), 'play-card', {
    nickname,
    cardIndex,
    card,
  })
})

lobbyEmitter.on('draw-card', (lobby: Lobby, nickname: string, card: Card, wasForced: boolean) => {
  broadcastTo(peers(lobby), 'draw-card', {
    nickname,
    card,
    wasForced,
  })
})

lobbyEmitter.on('turn-end', (lobby: Lobby) => {
  broadcastTo(peers(lobby), 'turn-end', {
    turn: lobby.turn,
    color: lobby.currentColor,
  })
})

lobbyEmitter.on('insert-player', (lobby: Lobby, player: Player) => {
  broadcastTo(peers(lobby), 'insert-player', player)
})

lobbyEmitter.on('choose-color', (lobby: Lobby, color: CardColor) => {
  broadcastTo(peers(lobby), 'choose-color', color)
})
