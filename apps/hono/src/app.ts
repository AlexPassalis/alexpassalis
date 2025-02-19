import { Postgres, postgresPing } from '@/lib/postgres/index'
import Redis from 'ioredis'
import { redisPing } from './lib/redis'
import newHono from '@/config/newHono'
import { pinoLogger } from '@/config/logger'
import { cors } from 'hono/cors'
import corsOptions from '@/config/corsOptions'
import newBetterAuth from '@/lib/better-auth/index'
import { Transporter } from '@/lib/nodemailer/index'

export default async function appBuildUp(
  postgres: Postgres,
  redis: Redis,
  nodemailer_auth_user: string,
  transporter: Transporter
) {
  await postgresPing(postgres)
  await redisPing(redis)

  const api = newHono().basePath('/api')
  api.use(pinoLogger())
  api.use('*', cors(corsOptions))
  api.use('*', async (c, next) => {
    c.env.postgres = postgres
    c.env.redis = redis
    await next()
  })

  api.get('/healthcheck', c => {
    return c.text('ok', 200)
  })

  const auth = newBetterAuth(postgres, nodemailer_auth_user, transporter)
  api.on(['POST', 'GET'], '/auth/**', c => {
    return auth.handler(c.req.raw)
  })

  return api
}
