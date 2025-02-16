// import { postgresBuildUp } from '@/lib/postgres'
// import env from '@/env'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { Postgres } from '@/lib/postgres'
import { user, session, account, verification } from '@/lib/postgres/schema'
import { magicLink } from 'better-auth/plugins'

/* This is for generating the better-auth tables using the CLI :
1. delete the ./src/api/auth/auth.schema.ts file
2. remove the auth tables from ./src/lib/postgres/schema.ts
3. uncomment the code right underneath and comment out the rest of the code inside this document
4. run 'pnpm run better-auth:generate' to generate the ./src/api/auth/auth.schema.ts file
5. import authSchema from ./src/api/auth/auth.authSchema.ts inside ./src/api/auth/auth.schema.ts
6. change the tables from pgTable() to authSchema.table()
7. export the tables from inside ./src/lib/postgres/schema.ts
8. run "pnpm run postgres:generate" to generate the ./src/lib/postgres/migrations files 
*/
// const { postgres } = postgresBuildUp(env.POSTGRES_URL, false)
// export const auth = betterAuth({
//   database: drizzleAdapter(postgres, {
//     provider: 'pg',
//   }),
// })

export default function newAuth(postgres: Postgres) {
  const auth = betterAuth({
    database: drizzleAdapter(postgres, {
      provider: 'pg',
      schema: {
        user: user,
        session: session,
        account: account,
        verification: verification,
      },
    }),
    plugins: [
      magicLink({
        sendMagicLink: async ({ email, token, url }) => {
          console.log('email', email)
          console.log('token', token)
          console.log('url', url)
        },
      }),
    ],
  })
  return auth
}
