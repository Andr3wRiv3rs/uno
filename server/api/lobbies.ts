import Router from 'koa-router'
import {
  Card,
  CardColor,
  CardType,
  KoaState,
  Lobby,
  Player,
} from '../../@types'
import * as constraints from '../../common/constraints'
import {
  AuthMiddleware, 
} from '../middleware'
import {
  insertLobby,
} from '../store'
import {
  getSafeLobby,
} from '../utils'

const router = new Router<KoaState>()

// const pickOne = <T> (array: Array<T>): T => {
//   return array[Math.floor(Math.random() * array.length)]
// }

const shuffle = <T> (source: Array<T>): T[] => {
  const array = [...source]

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }

  return array
}

const generateCards = (count: number, type: CardType): Card[] => {
  const colors: CardColor[] = ['red', 'green', 'blue', 'yellow', 'special']  

  const cards: Card[] = []

  for(let i = 0; i < count; i++) {
    for (const color of colors) {
      cards.push({
        color,
        type,
      })
    }
  }

  return cards
}

const generateSpecialCards = (count: number, type: CardType): Card[] => {
  const cards: Card[] = []

  for(let i = 0; i < count; i++) {
    cards.push({
      color: 'special',
      type,
    })
  }

  return cards
}

const generateDeck = (): Card[] => [
  ...generateCards(2, 0),
  ...generateCards(2, 1),
  ...generateCards(2, 2),
  ...generateCards(2, 3),
  ...generateCards(2, 4),
  ...generateCards(2, 5),
  ...generateCards(2, 6),
  ...generateCards(2, 7),
  ...generateCards(2, 8),
  ...generateCards(2, 9),
  ...generateCards(2, 'skip'),
  ...generateCards(2, 'reverse'),
  ...generateCards(2, 'draw-2'),
  ...generateSpecialCards(4, 'wild'),
  ...generateSpecialCards(4, 'wild-draw-4'),
]

const generatePlayer = (nickname: string): Player => {
  return {
    nickname,
    hand: [],
  }
}

router.post('/create', AuthMiddleware, ctx => {
  const { nickname, loggedIn } = ctx.state

  if (!loggedIn) return ctx.throw(401, 'Unauthorized.')

  const { name, isPrivate } = (ctx.request.body || {}) as Lobby

  if (!name || !constraints.name(name)) return ctx.throw(400, 'Invalid name. Must be 1-32 characters long.')
  if (typeof isPrivate !== 'boolean') return ctx.throw(400, 'Invalid private option. Must be a boolean.')

  const host = generatePlayer(nickname)

  const lobby: Lobby = {
    name,
    isPrivate,
    host,
    players: [host],
    turn: 1,
    discard: [],
    draw: shuffle(generateDeck()),
    order: 1,
    started: false,
    chat: [],
  }

  console.log(lobby.draw)

  insertLobby(lobby)

  ctx.body = getSafeLobby(lobby)
})

export default router.routes()
