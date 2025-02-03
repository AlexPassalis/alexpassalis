import CredentialsProvider from '@auth/core/providers/credentials'
import db from './../lib/db'
import { users } from './../routes/auth/auth.schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const fastifyNextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  trustHost: false,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { data: email, error: emailError } = z
          .string()
          .email()
          .safeParse(credentials.email)
        if (emailError) {
          return null
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)
        if (!user.length) return null

        const { data: password, error: passwordError } = z
          .string()
          .safeParse(credentials.password)
        if (passwordError) {
          return null
        }

        const isValid = await compare(password, user.password)
        if (!isValid) {
          return null
        }

        return user
      },
    }),
  ],
}

export default fastifyNextAuthOptions
