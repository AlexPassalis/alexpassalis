import type { FastifyCorsOptions } from '@fastify/cors'
import env from './../../env'

const fastifyCorsOptions = {
  origin: [env.NEXT_JS_ORIGIN],
  methods: ['GET', 'POST'],
} as FastifyCorsOptions

export default fastifyCorsOptions
