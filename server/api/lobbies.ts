import Router from 'koa-router'
import {
  KoaState,
  Lobby,
} from '../../@types'
import * as constraints from '../../common/constraints'
import {
  AuthMiddleware, 
} from '../middleware'
import {
  insertLobby,
} from '../store'
import {
  drawCards,
  generateDeck,
  generatePlayer,
  getSafeLobby,
  shuffle,
} from '../utils'

const router = new Router<KoaState>()

router.post('/create', AuthMiddleware, ctx => {
  const { nickname, loggedIn } = ctx.state

  if (!loggedIn) return ctx.throw(401, 'Unauthorized.')

  const { name, isPrivate } = (ctx.request.body || {}) as Lobby

  if (!name || !constraints.name(name)) return ctx.throw(400, 'Invalid name. Must be 1-32 characters long.')
  if (typeof isPrivate !== 'boolean') return ctx.throw(400, 'Invalid private option. Must be a boolean.')

  const draw = shuffle(generateDeck())
  const startIndex = draw.findIndex(({ type }) => typeof type === 'number')
  const discard = draw.splice(0, startIndex + 1)
  const host = generatePlayer(nickname, 0)

  drawCards(host, 7, draw)

  const lobby: Lobby = {
    name,
    isPrivate,
    host,
    players: [host],
    turn: 1,
    discard,
    draw,
    order: 1,
    started: false,
    chat: [],
    currentColor: discard[discard.length - 1].color,
    awaitingChoice: false,
  }

  insertLobby(lobby)

  ctx.body = getSafeLobby(lobby)
})

export default router.routes()
