import Fastify from 'fastify'

import { postgresPing, postgresTeardown } from './lib/postgres'
import { redisPing, redisTeardown } from './lib/redis'

import fastifyCors from '@fastify/cors'
import fastifyCorsOptions from './config/fastifyCorsOptions'

import fastifyMetrics from 'fastify-metrics'
import fastifyMetricsOptions from './config/fastifyMetricsOptions'

import fastifyCookies from '@fastify/cookie'
import fastifyCookiesOptions from './config/fastifyCookiesOptions'

import fastifyOauth2 from '@fastify/oauth2'
import fastifyOauth2Options from './config/fastifyOauth2Options'

import authRouter from './routes/auth/auth.router'
import env from './../env'

async function main() {
  await postgresPing()
  await redisPing()

  const app = Fastify({ logger: true })
  app.addHook('onClose', async () => {
    await postgresTeardown()
    await redisTeardown()
  })

  await app.register(fastifyCors, fastifyCorsOptions)
  await app.register(fastifyMetrics, fastifyMetricsOptions)
  await app.register(fastifyCookies, fastifyCookiesOptions)
  await app.register(fastifyOauth2, {
    name: 'google',
    credentials: {
      client: { id: '', secret: '' },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/api/auth/signup/google',
    callbackUri: 'https:/localhost/api/auth/signup/google/callback',
  })

  await app.register(authRouter, { prefix: '/api/auth' })

  try {
    await app.listen({
      port: env.FASTIFY_PORT,
      host: env.FASTIFY_HOST,
    })
  } catch (e) {
    app.log.error('Failed to start server')
    app.log.error(e)
    process.exit(1)
  }
}

main()
