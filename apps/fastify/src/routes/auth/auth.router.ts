import { FastifyInstance } from 'fastify'
import fastifyOauth2 from '@fastify/oauth2'
import { typeEmail } from './../../data/zod/type'
import {
  errorInvalidEmail,
  errorPostgres,
  errorRedis,
  errorSendingEmail,
} from './../../data/zod/error'
import postgres from './../../lib/postgres/index'
import { eq } from 'drizzle-orm'
import { usersTable } from './auth.schema'
import {
  emailCooldown,
  emailInUse,
  emailSuccess,
} from './../../data/zod/expected'
import logger from '../../config/logger'
import redis from './../../lib/redis/index'
import jwt from 'jsonwebtoken'
import env from './../../../env'
import { sendVeficationEmail } from './../../lib/nodemailer/index'

export default async function authRouter(fastify: FastifyInstance) {
  fastify.register(fastifyOauth2, {
    name: 'googleOAuth2',
    scope: ['email', 'profile'],
    credentials: {
      client: {
        id: env.GOOGLE_CLIENT_ID,
        secret: env.GOOGLE_CLIENT_SECRET,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/auth/google',
    callbackUri: `${env.NEXT_PUBLIC_FASTIFY_BASE_URL}/auth/google/callback`,
  })
    '/signup/email',
    async (request, reply) => {
      const email = request.body?.email

      const { data: emailValidated } = typeEmail.safeParse(email)
      if (!emailValidated) {
        reply.status(400).send({ message: errorInvalidEmail })
        return
      }

      try {
        const postgresLookup = await postgres
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, emailValidated))
          .limit(1)
          .execute()
        if (postgresLookup[0]) {
          reply.status(200).send({ message: emailInUse })
          return
        }
      } catch (e) {
        logger.info('/api/auth/signup error postgres lookup')
        logger.error(e)
        reply.status(400).send({ message: errorPostgres })
        return
      }

      const signupKey = `signup:${emailValidated}`

      try {
        const inCooldown = await redis.get(signupKey)
        if (inCooldown) {
          reply.status(200).send({ message: emailCooldown })
          return
        }
      } catch (e) {
        logger.info('/api/auth/signup error redis lookup')
        logger.error(e)
        reply.status(400).send({ message: errorRedis })
        return
      }

      let token;
      try {
        token = jwt.sign({ email: emailValidated }, env.JWT_SECRET, {
          algorithm: 'HS256',
          expiresIn: '1h',
        })
        await sendVeficationEmail(token, email)
      } catch (e) {
        logger.info('/api/auth/signup error sending email')
        logger.error(e)
        reply.status(400).send({ message: errorSendingEmail })
        return
      }

      try {
        await redis.set(signupKey, 'true', 'EX', 3600)
      } catch (e) {
        logger.info('/api/auth/signup error setting key')
        logger.error(e)
      }

      reply.send({ message: emailSuccess })
    }
  )

  fastify.get('/auth/google/callback', async function (request, reply) {
    const token = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
    console.log(token.access_token)

    // Handle the token, e.g., create a session or user in the database

    reply.redirect('/some-redirect-url') // Redirect to a desired page after successful authentication
  })
}
