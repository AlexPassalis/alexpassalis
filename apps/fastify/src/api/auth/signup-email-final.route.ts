import { FastifyInstance } from 'fastify'
import { ROUTE_AUTH, ROUTE_SIGNUP_EMAIL_FINAL } from '../../data/routes'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import env from '../../../env'
import { tokenExpired, replySuccessful } from '../../data/zod/expected'
import { typeEmail, typeUsername } from '../../data/zod/type'
import {
  errorEmailInvalid,
  errorPostgres,
  errorTokenInvalid,
  errorUnexpected,
  errorUsernameInvalid,
} from '../../data/zod/error'
import postgres from '../../lib/postgres'
import { usersTable } from './auth.schema'
import { v4 as uuid } from 'uuid'

export default async function signupEmailFinalRoute(fastify: FastifyInstance) {
  fastify.post<{ Body: { token: string; username: string } }>(
    ROUTE_SIGNUP_EMAIL_FINAL,
    async (request, reply) => {
      const token = request.body?.token

      let payload
      try {
        payload = jwt.verify(token, env.JWT_SECRET) as {
          email: string
          iat: number
          exp: number
        }
      } catch (e) {
        if (e instanceof TokenExpiredError) {
          reply.status(200).send({ message: tokenExpired })
          return
        } else if (e instanceof JsonWebTokenError) {
          fastify.log.error(
            { error: e },
            `${ROUTE_AUTH}${ROUTE_SIGNUP_EMAIL_FINAL} token invalid`
          )
          reply.status(500).send({ message: errorTokenInvalid })
          return
        } else {
          fastify.log.error(
            { error: e },
            `${ROUTE_AUTH}${ROUTE_SIGNUP_EMAIL_FINAL} unexpected`
          )
          reply.status(500).send({ message: errorUnexpected })
          return
        }
      }

      const username = request.body?.username
      const { error: usernameError, data: usernameValidated } =
        typeUsername.safeParse(username)
      if (usernameError) {
        fastify.log.error(
          { error: errorUsernameInvalid },
          `${ROUTE_AUTH}${ROUTE_SIGNUP_EMAIL_FINAL} username invalid`
        )
        reply.status(500).send({ message: errorUsernameInvalid })
        return
      }

      try {
        const usernameInUse = await postgres
          .select()
          .from(usersTable)
          .where(eq(usersTable.username, emailValidated))
          .limit(1)
          .execute()
        if (postgresLookup[0]) {
          reply.status(200).send({ message: emailInUse })
          return
        }
      } catch (e) {
        fastify.log.info('/api/auth/signup error postgres lookup')
        fastify.log.error(e)
        reply.status(400).send({ message: errorPostgres })
        return
      }

      const { error: emailError, data: emailValidated } = typeEmail.safeParse(
        payload.email
      )
      if (emailError) {
        fastify.log.error(
          { error: emailError },
          `${ROUTE_AUTH}${ROUTE_SIGNUP_EMAIL_FINAL} email invalid`
        )
        reply.status(500).send({ message: errorEmailInvalid })
        return
      }

      try {
        await postgres.insert(usersTable).values({
          id: uuid(),
          provider: 'email',
          provider_id: null,
          email: emailValidated,
          name: usernameValidated,
          picture: null,
          created_at: new Date(),
          updated_at: new Date(),
        })
      } catch (e) {
        fastify.log.error(
          { error: e },
          `${ROUTE_AUTH}${ROUTE_SIGNUP_EMAIL_FINAL} postgres`
        )
        reply.status(500).send({ message: errorPostgres })
        return
      }

      reply.status(200).send({ message: replySuccessful })
    }
  )
}
