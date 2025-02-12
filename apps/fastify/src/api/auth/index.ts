import { FastifyInstance } from 'fastify'
import signupEmailRoute from './signup-email.route'
import signupEmailFinalRoute from './signup-email-final.route'
import googleCallbackRoute from './google-callback.route'

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.register(signupEmailRoute)
  fastify.register(signupEmailFinalRoute)
  fastify.register(googleCallbackRoute)
}
