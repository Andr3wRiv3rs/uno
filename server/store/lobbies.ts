import {
  CardColor,
  Lobby,
} from "../../@types"
import {
  EventEmitter, 
} from "events"
import {
  generateDeck,
  generatePlayer,
  shuffle, 
} from "../utils"

export const lobbyEmitter = new EventEmitter()

export const lobbies: Lobby[] = []

export const insertLobby = (lobby: Lobby): void => {
  lobbies.push(lobby)
  lobbyEmitter.emit('insert-lobby', lobby)
}

export const updateLobby = (lobby: Lobby, payload: Record<string, unknown>): void => {
  Object.assign(lobby, payload)
  lobbyEmitter.emit('lobby-update', lobby, payload)
}

export const updatePlayer = (lobby: Lobby, nickname: string, payload: Record<string, unknown>): void => {
  Object.assign(lobby.players.find(player => player.nickname === nickname), payload)
  lobbyEmitter.emit('player-update', lobby, nickname, payload)
}

export const insertPlayer = (lobby: Lobby, nickname: string): void => {
  const player = generatePlayer(nickname, lobby.players.length)

  player.hand.push(...lobby.draw.splice(0, 7))

  lobby.players.push(player)

  lobbyEmitter.emit('insert-player', lobby, player)
}

const updateTurn = (lobby: Lobby) => {
  lobby.turn += lobby.order
      
  if (lobby.turn > lobby.players.length - 1) lobby.turn = 0
  if (lobby.turn < 0) lobby.turn = lobby.players.length - 1
}

export const drawCard = (lobby: Lobby, nickname: string, wasForced: boolean): void => {
  const player = lobby.players.find(player => nickname === player.nickname)

  if (lobby.draw.length === 1) {
    lobby.draw.push(...shuffle(generateDeck()))
  }

  // TODO: unify constraints
  if (!player) throw `Received invalid player nickname from ${nickname}.`

  if (lobby.turn !== player.index) throw `Player ${nickname} tried to play a card when it wasn't their turn.`

  const [card] = lobby.draw.splice(-1)

  player.hand.push(card)

  if (!wasForced) updateTurn(lobby)

  // TODO: check if player has any playable cards

  lobbyEmitter.emit('draw-card', lobby, nickname, card, wasForced)

  updateLobby(lobby, {
    turn: lobby.turn,
  })
}

export const chooseColor = (lobby: Lobby, nickname: string, color: CardColor): void => {
  const player = lobby.players.find(player => nickname === player.nickname)

  // TODO: validate inputs

  if (!lobby.awaitingChoice) throw `Not awaiting a color choice.`

  if (!player) throw `Received invalid player nickname from ${nickname}.`

  if (lobby.turn !== player.index) throw `Player ${nickname} tried to play a card when it wasn't their turn.`

  updateLobby(lobby, {
    currentColor: color,
    awaitingChoice: false,
  })

  const [lastCard] = lobby.discard.slice(-1)

  if (lastCard.type === 'wild-draw-4') {
    updateTurn(lobby)
    drawCard(lobby, lobby.players[lobby.turn].nickname, true)
    drawCard(lobby, lobby.players[lobby.turn].nickname, true)
    drawCard(lobby, lobby.players[lobby.turn].nickname, true)
    drawCard(lobby, lobby.players[lobby.turn].nickname, true)
  }

  updateTurn(lobby)

  lobbyEmitter.emit('choose-color', lobby, color)
  lobbyEmitter.emit('turn-end', lobby)
}

export const playCard = (lobby: Lobby, nickname: string, cardIndex: number): void => {
  const player = lobby.players.find(player => nickname === player.nickname)

  if (!player) throw `Received invalid player nickname from ${nickname}.`

  const card = player.hand[cardIndex]

  if (!card) throw `Received invalid card index from ${nickname}.`

  const [lastCard] = lobby.discard.slice(-1)

  const isSpecialCard = card.color === 'special'
  const isSameType = card.type === lastCard.type
  const isSameColor = card.color === lobby.currentColor

  if (lobby.turn !== player.index) throw `Player ${nickname} tried to play a card when it wasn't their turn.`

  if (isSpecialCard || isSameType || isSameColor) {
    lobby.discard.push(player.hand.splice(cardIndex, 1)[0])

    lobbyEmitter.emit('play-card', lobby, nickname, cardIndex)

    switch (card.type) {
      case 'draw-2':
        updateTurn(lobby)
        drawCard(lobby, lobby.players[lobby.turn].nickname, true)
        drawCard(lobby, lobby.players[lobby.turn].nickname, true)
        updateTurn(lobby)
        break

      case 'skip':
        updateTurn(lobby)
        updateTurn(lobby)
        break

      case 'reverse':
        lobby.order *= -1
        updateTurn(lobby)

        if (lobby.players.length === 2) {
          updateTurn(lobby)
        }
        break

      case 'wild':
      case 'wild-draw-4':
        lobby.awaitingChoice = true
        break

      default:
        updateTurn(lobby)
        break
    }

    updateLobby(lobby, {
      discard: lobby.discard,
      currentColor: card.color,
      awaitingChoice: lobby.awaitingChoice,
    })
  }

  lobbyEmitter.emit('turn-end', lobby)
}
