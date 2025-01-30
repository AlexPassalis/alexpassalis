import Fastify from 'fastify'

import db, { pool } from './db'
import { sql } from 'drizzle-orm'

import fastifyCors from '@fastify/cors'
import fastifyCorsOptions from './conf/fastifyCorsOptions'

import s from './routes/index'
import usersRouter from './routes/users/users.router'

const app = Fastify({ logger: true })

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

  await app.register(fastifyCors, fastifyCorsOptions)

  app.register(s.plugin(usersRouter))
}

export default app
