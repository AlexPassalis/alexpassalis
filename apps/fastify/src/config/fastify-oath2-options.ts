import type { FastifyOAuth2Options } from '@fastify/oauth2'
import env from './../../env'
import fastifyOauth2 from '@fastify/oauth2'

const fastifyOauth2Options = {
  name: 'google',
  scope: ['email', 'profile'],
  credentials: {
    client: {
      id: env.GOOGLE_CLIENT_ID,
      secret: env.GOOGLE_CLIENT_SECRET,
    },
    auth: fastifyOauth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: '/api/auth/google',
  callbackUri: 'https://localhost/api/auth/google/callback',
} as FastifyOAuth2Options

export default fastifyOauth2Options
