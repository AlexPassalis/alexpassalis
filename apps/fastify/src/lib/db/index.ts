import { Pool } from 'pg'
import env from './../../../env'

import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DB_MIGRATING ? 1 : undefined,
  ssl: false,
})

const db = drizzle(pool, { schema })

export default db
