import { FastifyInstance } from 'fastify'
import axios from 'axios'
import postgres from '../../lib/postgres'
import { eq } from 'drizzle-orm'
import { usersTable } from './auth.schema'
import { errorPostgres } from '../../data/zod/error'
import { v4 as uuid } from 'uuid'

export default async function googleCallbackRoute(fastify: FastifyInstance) {
  fastify.get('/google/callback', async function (request, reply) {
    let token
    try {
      const result =
        await fastify.google.getAccessTokenFromAuthorizationCodeFlow(request)

      token = result?.token
      if (!token) {
        fastify.log.info('/api/auth/google/callback error no token')
        fastify.log.error(request)
        reply
          .status(400)
          .send({ message: 'No token returned from Google OAuth2' })
        return
      }
    } catch (e) {
      fastify.log.info('/api/auth/google/callback error getting token')
      fastify.log.error(e)
      reply
        .status(500)
        .send({ message: 'Failed to retrieve token from Google' })
      return
    }

    let googleUserData
    try {
      const response = await axios.get<{
        id: string
        email: string
        name: string
        picture?: string
      }>('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      })
      googleUserData = response?.data
      if (!googleUserData) {
        fastify.log.info('/api/auth/google/callback error no data')
        fastify.log.error(request)
        reply
          .status(400)
          .send({ message: 'No data returned from Google OAuth2' })
        return
      }
    } catch (e) {
      fastify.log.info('/api/auth/google/callback error getting data')
      fastify.log.error(e)
      reply.status(500).send({ message: 'Failed to retrieve data from Google' })
      return
    }

    try {
      const postgresLookup = await postgres
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, googleUserData.email))
        .limit(1)
        .execute()
      if (postgresLookup[0]) {
        reply.status(200).send({ message: 'email already in use' })
        return
      }
    } catch (e) {
      fastify.log.info('/api/auth/google/callback error postgres lookup')
      fastify.log.error(e)
      reply.status(400).send({ message: errorPostgres })
      return
    }

    try {
      await postgres.insert(usersTable).values({
        id: uuid(),
        email: googleUserData.email,
        username: googleUserData.name,
        picture: googleUserData.picture || null,
        provider: 'google',
        provider_id: googleUserData.id,
        created_at: new Date(),
        updated_at: new Date(),
      })
    } catch (e) {
      fastify.log.info('/api/auth/google/callback error postgres insert')
      fastify.log.error(e)
      reply.status(500).send({ message: 'asdasdasdasdasd' }) // NEEDS FIXING
      return
    }

    // if later need to refresh the token this can be used
    // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

    reply.send({ access_token: token.access_token })
  })
}
