import { Pool } from 'pg'
import env from '../../../env'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import { sql } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'

const postgresPool = new Pool({
  connectionString: env.POSTGRES_URL,
  max: env.POSTGRES_MIGRATING ? 1 : undefined,
  ssl: false,
})

export async function postgresTeardown(fastify: FastifyInstance) {
  try {
    await postgresPool.end()
    fastify.log.info('Postgres disconnected successfully')
  } catch (e) {
    fastify.log.error({ error: e }, 'Postgres disconnection failed')
  }
}

const postgres = drizzle(postgresPool, { schema })

export async function postgresPing(fastify: FastifyInstance) {
  try {
    await postgres.execute(sql`SELECT 1`)
    fastify.log.info('Postgres connection succeeded')
  } catch (e) {
    fastify.log.fatal({ error: e }, 'Postgres connection failed')
    process.exit(1)
  }
}

export default postgres
