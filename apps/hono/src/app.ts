import { Postgres, postgresPing } from '@/lib/postgres/index'
import Redis from 'ioredis'
import { redisPing } from './lib/redis'
import newHono from '@/utils/newHono'
import { pinoLogger } from '@/config/logger'
import { cors } from 'hono/cors'
import newAuth from '@/config/newAuth'
import auth from '@/api/auth/index'

export default async function appBuildUp(postgres: Postgres, redis: Redis) {
  await postgresPing(postgres)
  await redisPing(redis)

  const api = newHono().basePath('/api')
  api.use(pinoLogger())

  api.use('*', async (c, next) => {
    c.env.postgres = postgres
    c.env.redis = redis
    await next()
  })

  const betterAuth = newAuth(postgres)
  api.on(['POST', 'GET'], '/api/auth/**', c => betterAuth.handler(c.req.raw))

  api.get('/healthcheck', c => {
    c.status(200)
    return c.text('ok')
  })

  api.route('/auth', auth)

  return api
}
