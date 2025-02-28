import { defineConfig } from 'drizzle-kit'
import env from './src/env'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: env.POSTGRES_URL! },
  schemaFilter: ['public', 'auth'],
  schema:
    env.NODE_ENV === 'production'
      ? './src/lib/postgres/schema.js'
      : './src/lib/postgres/schema.ts',
  out: './src/lib/postgres/migrations',
  verbose: true,
  strict: true,
})
