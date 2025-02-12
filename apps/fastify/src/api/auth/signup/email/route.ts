import { FastifyInstance } from 'fastify'
import { typeEmail } from '../../data/zod/type'
import {
  errorEmailInvalid,
  errorEmailSending,
  errorPostgres,
  errorRedis,
} from '../../data/zod/error'
import postgres from '../../lib/postgres'
import { usersTable } from './auth.schema'
import { eq } from 'drizzle-orm'
import { emailInCooldown, emailInUse } from '../../data/zod/expected'
import redis from '../../lib/redis'
import jwt from 'jsonwebtoken'
import env from '../../../env'
import { sendVeficationEmail } from '../../lib/nodemailer'

export default async function signupEmailRoute(fastify: FastifyInstance) {
  fastify.post(
    '/signup/email',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            required: ['email'],
            additionalProperties: false,
          },
        },
      },
    },
    async (request, reply) => {
      const email = request.body?.email

      // const { data: emailValidated } = typeEmail.safeParse(email)
      // if (!emailValidated) {
      //   reply.status(400).send({ message: errorEmailInvalid })
      //   return
      // }

      // try {
      //   const postgresLookup = await postgres
      //     .select()
      //     .from(usersTable)
      //     .where(eq(usersTable.email, emailValidated))
      //     .limit(1)
      //     .execute()
      //   if (postgresLookup[0]) {
      //     reply.status(200).send({ message: emailInUse })
      //     return
      //   }
      // } catch (e) {
      //   fastify.log.info('/api/auth/signup error postgres lookup')
      //   fastify.log.error(e)
      //   reply.status(400).send({ message: errorPostgres })
      //   return
      // }

      // const signupKey = `signup:${emailValidated}`
      // try {
      //   const inCooldown = await redis.get(signupKey)
      //   if (inCooldown) {
      //     reply.status(200).send({ message: emailInCooldown })
      //     return
      //   }
      // } catch (e) {
      //   fastify.log.info('/api/auth/signup error redis lookup')
      //   fastify.log.error(e)
      //   reply.status(400).send({ message: errorRedis })
      //   return
      // }

      // let token
      // try {
      //   token = jwt.sign({ email: emailValidated }, env.JWT_SECRET, {
      //     algorithm: 'HS256',
      //     expiresIn: '1h',
      //   })
      // } catch (e) {
      //   fastify.log.info('/api/auth/signup error signing token')
      //   fastify.log.error(e)
      //   reply.status(400).send({ message: '@@@@@@!!!@@!@#' }) // NEEDS FIXING
      //   return
      // }

      // try {
      //   await sendVeficationEmail(token, email)
      // } catch (e) {
      //   fastify.log.info('/api/auth/signup error sending email')
      //   fastify.log.error(e)
      //   reply.status(400).send({ message: errorEmailSending })
      //   return
      // }

      // try {
      //   await redis.set(signupKey, 'true', 'EX', 3600)
      // } catch (e) {
      //   fastify.log.info('/api/auth/signup error setting key')
      //   fastify.log.error(e)
      // }

      // reply.status(200).send({ message: emailSentSuccessfully })
    }
  )
}
