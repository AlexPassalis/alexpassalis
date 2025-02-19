import env from '@/env'
import { postgresBuildUp } from '../postgres'
import { betterAuth } from 'better-auth/*'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

/* This is for generating the better-auth tables using the CLI :
1. delete the ./src/api/auth/auth.schema.ts file
2. remove the auth tables from ./src/lib/postgres/schema.ts
4. run 'pnpm run better-auth:generate' to generate the ./src/api/auth/auth.schema.ts file
5. import authSchema from ./src/api/auth/auth.authSchema.ts inside ./src/api/auth/auth.schema.ts
6. change the tables from pgTable() to authSchema.table()
7. export the tables from inside ./src/lib/postgres/schema.ts
8. run "pnpm run postgres:generate" to generate the ./src/lib/postgres/migrations files 
*/

const { postgres } = postgresBuildUp(env.POSTGRES_URL, false)
export const auth = betterAuth({
  database: drizzleAdapter(postgres, {
    provider: 'pg',
  }),
})
