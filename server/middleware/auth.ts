import {
  Middleware, 
} from 'koa'
import {
  KoaState,
} from '../../@types'
import * as constraints from '../../common/constraints'

export const AuthMiddleware: Middleware<KoaState> = async (ctx, next): Promise<void> => {
  const nickname = ctx.cookies.get('nickname')

  ctx.state.loggedIn = constraints.name(nickname)

  if (ctx.state.loggedIn) ctx.state.nickname = nickname

  await next()
}
