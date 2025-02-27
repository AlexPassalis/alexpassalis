import { Postgres, postgresPing } from '@/lib/postgres/index'
import Redis from 'ioredis'
import { redisPing } from '@/lib/redis/index'
import newHono from '@/config/newHono'
import { pinoLogger } from '@/config/logger'
import { cors } from 'hono/cors'
import corsOptions from '@/config/corsOptions'
import newBetterAuth from '@/lib/better-auth/index'
import { EmailInfo, Transporter } from '@/lib/nodemailer/index'

export default async function appBuildUp(
  postgres: Postgres,
  redis: Redis,
  emailInfo: undefined | EmailInfo,
  nodemailer_auth_user: string,
  transporter: Transporter
) {
  await postgresPing(postgres)
  await redisPing(redis)

  const api = newHono().basePath('/api')
  api.get('/hono', c => {
    return c.text('ok', 200)
  })

  api.use(pinoLogger())
  api.use('*', cors(corsOptions))
  api.use('*', async (c, next) => {
    c.env.postgres = postgres
    c.env.redis = redis
    await next()
  })

  const auth = newBetterAuth(
    postgres,
    emailInfo,
    nodemailer_auth_user,
    transporter
  )
  api.on(['POST', 'GET'], '/auth/**', c => {
    return auth.handler(c.req.raw)
  })

  return api
}
