import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { typeEmail } from '@/data/zod/type'
import {
  errorBodyInvalid,
  errorEmailSending,
  errorPostgres,
  errorRedis,
} from '@/data/zod/error'
import { usersTable } from '@/api/auth/schema'
import { eq } from 'drizzle-orm'
import {
  emailInCooldown,
  emailInUse,
  responseSuccessful,
} from '@/data/zod/expected'
import { logger } from '@/config/logger'
import { sign } from 'hono/jwt'
import env from '@/env'
import { sendEmailVefication } from '@/lib/nodemailer'
import newHono from '@/utils/newHono'
import { Postgres } from '@/lib/postgres'
import Redis from 'ioredis'

const auth = newHono()
auth.get(
  '/signup',
  // zValidator('json', z.object({ email: typeEmail }), (result, c) => {
  //   if (!result.success) {
  //     return c.json({ message: errorBodyInvalid }, 400)
  //   }
  // }),
  async c => {
    // const { email } = c.req.valid('json')

    return c.json({ message: responseSuccessful }, 200)
  }
)

export default auth

// try {
//   const postgresLookup = await postgres
//     .select()
//     .from(usersTable)
//     .where(eq(usersTable.email, email))
//     .limit(1)
//     .execute()
//   if (postgresLookup[0]) {
//     return c.json({ message: emailInUse }, 200)
//   }
// } catch (e) {
//   logger.error({ error: e }, '/api/auth/signup/email postgres')
//   return c.json({ message: errorPostgres }, 400)
// }

// const signupKey = `signup:${email}`

// try {
//   const inCooldown = await redis.get(signupKey)
//   if (inCooldown) {
//     return c.json({ message: emailInCooldown }, 200)
//   }
// } catch (e) {
//   logger.error({ error: e }, '/api/auth/signup/email redis')
//   return c.json({ message: errorRedis }, 400)
// }

// const token = await sign(
//   { email, exp: Math.floor(Date.now() / 1000) + 3600 },
//   env.JWT_SECRET,
//   'HS256'
// )

// try {
//   await sendEmailVefication(token, email)
// } catch (e) {
//   logger.error({ error: e }, '/api/auth/signup/email sending email')
//   return c.json({ message: errorEmailSending }, 400)
// }

// try {
//   await redis.set(signupKey, 'true', 'EX', 3600)
// } catch (e) {
//   logger.error({ error: e }, '/api/auth/signup/email redis set')
// }

// return c.json({ message: responseSuccessful }, 200)
