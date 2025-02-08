import Redis from 'ioredis'
import env from './../../../env'
import logger from './../../config/logger'

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
})

export async function redisPing() {
  try {
    const result = await redis.ping()
    if (result === 'PONG') {
      logger.info('Redis connection succeeded')
    } else {
      throw new Error(`Unexpected ping result: ${result}`)
    }
  } catch (e) {
    logger.info('Redis connection failed')
    logger.error(e)
    process.exit(1)
  }
}

export async function redisTeardown() {
  try {
    await redis.quit()
    logger.info('Redis disconnected successfully')
  } catch (e) {
    logger.info('Redis disconnection failed')
    logger.error(e)
    process.exit(1)
  }
}

export default redis
