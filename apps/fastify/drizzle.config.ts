import { defineConfig } from 'drizzle-kit'
import env from './env'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: env.POSTGRES_URL },
  schemaFilter: ['public', 'auth'],
  schema: './src/lib/postgres/schema.ts',
  out: './src/lib/postgres/migrations',
  verbose: true,
  strict: true,
})
