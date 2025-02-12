import { postgresPing, postgresTeardown } from './lib/postgres'
import { redisPing, redisTeardown } from './lib/redis'

import Fastify from 'fastify'
import fastifyLoggerOptions from './config/fastify-logger-options'

import fastifyCors from '@fastify/cors'
import fastifyCorsOptions from './config/fastify-cors-options'

import fastifyMetrics from 'fastify-metrics'
import fastifyMetricsOptions from './config/fastify-metrics-options'

import fastifyCookie from '@fastify/cookie'
import fastifyCookieOptions from './config/fastify-cookie-options'

import fastifyOauth2 from '@fastify/oauth2'
import fastifyOauth2Options from './config/fastify-oath2-options'

import authRoutes from './routes/auth/index'
import env from './../env'
import { ROUTE_AUTH } from './data/routes'

async function main() {
  const fastify = Fastify(fastifyLoggerOptions)
  fastify.addHook('onClose', async () => {
    await postgresTeardown(fastify)
    await redisTeardown(fastify)
  })

  await postgresPing(fastify)
  await redisPing(fastify)

  await fastify.register(fastifyCors, fastifyCorsOptions)
  await fastify.register(fastifyMetrics, fastifyMetricsOptions)
  await fastify.register(fastifyCookie, fastifyCookieOptions)
  await fastify.register(fastifyOauth2, fastifyOauth2Options)

  await fastify.register(authRoutes, { prefix: ROUTE_AUTH })

  try {
    await fastify.listen({
      port: env.FASTIFY_PORT,
      host: env.FASTIFY_HOST,
    })
  } catch (e) {
    fastify.log.fatal({ error: e }, 'Failed to start server')
    process.exit(1)
  }
}

main()
