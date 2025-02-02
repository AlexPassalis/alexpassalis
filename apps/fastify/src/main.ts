import Fastify from 'fastify'

import fastifyLoggerOptions from './config/fastifyLoggerOptions'

import db, { pool } from './lib/db'
import { sql } from 'drizzle-orm'

// import fastifyCors from '@fastify/cors'
// import fastifyCorsOptions from './config/fastifyCorsOptions'

// import fastifyMetrics from 'fastify-metrics'
// import fastifyMetricsOptions from './config/fastifyMetricsOptions'

import { toNodeHandler } from 'better-auth/node'
import auth from './lib/auth'

import s from './routes/index'
import usersRouter from './routes/users/users.router'

const app = Fastify(fastifyLoggerOptions)

app.addHook('onClose', (instance, done) => {
  pool
    .end()
    .then(() => done())
    .catch(done)
})

export async function serverSetup() {
  try {
    await db.execute(sql`SELECT 1`)
    app.log.info('Postgres connected successfully')
  } catch (error) {
    app.log.error({ err: error }, 'Failed to connect to Postgres')
    process.exit(1)
  }

  // await app.register(fastifyCors, fastifyCorsOptions)
  // await app.register(fastifyMetrics, fastifyMetricsOptions)

  app.all('/api/auth/*', (request, reply) => {
    const handler = toNodeHandler(auth)
    handler(request.raw, reply)
  })

  app.register(s.plugin(usersRouter))
}

export default app
