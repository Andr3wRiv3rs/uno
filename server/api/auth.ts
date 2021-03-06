import Router from 'koa-router'
import {
  KoaState,
} from '../../@types'
import * as constraints from '../../common/constraints'

const YEAR = 31556952000

const router = new Router<KoaState>()

router.get('/', ctx => {
  const nickname = ctx.cookies.get('nickname')

  if (!nickname) return ctx.throw(401, 'Unauthorized.')

  ctx.body = {
    nickname,
  }
})

router.post('/set-nickname', ctx => {
  const { nickname } = ctx.request.body

  if (!constraints.name(nickname)) return ctx.throw(400, 'Invalid name. Must be 1-32 characters long.')

  // don't try this at home
  const domain = ctx.origin.replace(/https?:\/\//, '').replace(/:[0-9]+/, '')

  ctx.cookies.set('nickname', nickname, {
    expires: new Date(Date.now() + YEAR),
    sameSite: 'lax',
    domain,
    secure: ctx.origin.includes('https://'),
  })

  ctx.body = ''
})

export default router.routes()
