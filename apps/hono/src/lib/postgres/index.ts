import pkg from 'pg'
const { Pool } = pkg
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '@/lib/postgres/schema'
import { logger } from '@/config/logger'
import { sql } from 'drizzle-orm'

export function postgresBuildUp(
  postgres_url: string,
  postgres_migrating: boolean
) {
  const postgresPool = new Pool({
    connectionString: postgres_url,
    max: postgres_migrating ? 1 : undefined,
    ssl: false,
  })
  const postgres = drizzle(postgresPool, { schema })
  return { postgresPool, postgres }
}

export type PostgresPool = ReturnType<typeof postgresBuildUp>['postgresPool']
export type Postgres = ReturnType<typeof postgresBuildUp>['postgres']

export async function postgresTearDown(postgresPool: PostgresPool) {
  try {
    await postgresPool.end()
    logger.info('Postgres disconnected successfully')
  } catch (e) {
    logger.error({ error: e }, 'Postgres disconnection failed')
  }
}

export async function postgresPing(postgres: Postgres) {
  try {
    await postgres.execute(sql`SELECT 1`)
    logger.info('Postgres connected successfully')
  } catch (e) {
    logger.fatal({ error: e }, 'Postgres connection failed')
    process.exit(1)
  }
}
