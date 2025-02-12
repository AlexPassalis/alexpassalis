import Redis from 'ioredis'
import env from './../../../env'
import { FastifyInstance } from 'fastify'

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
})

export async function redisTeardown(fastify: FastifyInstance) {
  try {
    await redis.quit()
    fastify.log.info('Redis disconnected successfully')
  } catch (e) {
    fastify.log.error({ error: e }, 'Redis disconnection failed')
  }
}

export async function redisPing(fastify: FastifyInstance) {
  try {
    const result = await redis.ping()
    if (result === 'PONG') {
      fastify.log.info('Redis connection succeeded')
    } else {
      throw new Error(`Unexpected redis ping result: ${result}`)
    }
  } catch (e) {
    fastify.log.fatal({ error: e }, 'Redis connection failed')
    process.exit(1)
  }
}

export default redis
