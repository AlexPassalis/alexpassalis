import { Pool } from 'pg'
import env from '../../../env'

import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import { sql } from 'drizzle-orm'
import logger from '../../config/logger'

export const postgresPool = new Pool({
  connectionString: env.POSTGRES_URL,
  max: env.POSTGRES_MIGRATING ? 1 : undefined,
  ssl: false,
})

export async function postgresTeardown() {
  try {
    await postgresPool.end()
    logger.info('Postgres disconnected successfully')
  } catch (e) {
    logger.info('Postgres disconnection failed')
    logger.error(e)
    process.exit(1)
  }
}

const postgres = drizzle(postgresPool, { schema })

export async function postgresPing() {
  try {
    await postgres.execute(sql`SELECT 1`)
    logger.info('Postgres connection succeeded')
  } catch (e) {
    logger.info('Postgres connection failed')
    logger.error(e)
    process.exit(1)
  }
}

export default postgres
