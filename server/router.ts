import path from 'path'
import fs from 'fs'
import koa from 'koa'
import compression from 'koa-compress'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import api from './api'
import * as config from '../config'
import WebsocketServer from './websockets'
import http, {
  IncomingMessage, 
} from 'http'
import {
  httpLogTag,
  getTimestamp,
} from './utils'
import {
  Socket, 
} from 'net'
import {
  KoaState,
} from '../@types'

const app = new koa<KoaState>()
const router = new Router<KoaState>()
const httpServer = http.createServer(app.callback())

app.use(async (ctx, next) => {
  await next()

  console.log(httpLogTag, getTimestamp(), ctx.method.toUpperCase(), ctx.path, `(${ctx.response.status})`)
})

httpServer.on('upgrade', async (request: IncomingMessage, socket: Socket, head: Buffer) => {
  const [nickname] = request.headers.cookie?.match(/(?<=nickname=)[^;]+/) || []

  WebsocketServer.server.handleUpgrade(request, socket, head, ws => {
    WebsocketServer.server.emit('connection', ws, nickname, request)
  })
})

app.use(compression({
  filter (contentType: string) {
    return /text\/(?!javascript|css)/i.test(contentType)
  },
}))

app.use(bodyParser())

app.on('error', console.error)

// TODO: write more elegantly
router.get('/verify/:id/:token', ctx => {
  ctx.redirect(`http://localhost:4000/verify/${ctx.params.id}/${ctx.params.token}`)
})

router.use('/api', api)

app.use(router.routes())

if (process.env.NODE_ENV === 'production') {
  app.use(ctx => {
    if (ctx.status !== 404) return

    const file = path.join(process.cwd(), 'dist/client', ctx.path)
    const index = path.join(process.cwd(), 'dist/client/index.html')

    if (fs.existsSync(index)) {
      const result = ctx.path === '/' || !fs.existsSync(file) ? index : file
      const [extension] = /\.[^.]+$/.exec(result)
      ctx.type = extension
      ctx.body = fs.createReadStream(result)
    } else {
      throw new Error('Client hasn\'t been built yet.')
    }
  })
}

httpServer.listen(process.env.PORT || config.port)

console.log(`${httpLogTag} HTTP server running on port ${config.port}.`)
