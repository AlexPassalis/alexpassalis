import { defineConfig } from 'drizzle-kit'
import env from './env'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: env.DATABASE_URL },
  schemaFilter: ['public', 'private'],
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  verbose: true,
  strict: true,
})
