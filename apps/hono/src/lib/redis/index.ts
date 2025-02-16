import Redis from 'ioredis'
import { logger } from '@/config/logger'

export function redisBuildUp(
  redis_host: string,
  redis_port: number,
  redis_password: string
) {
  const redis = new Redis({
    host: redis_host,
    port: redis_port,
    password: redis_password,
  })
  return redis
}

export async function redisTeardown(redis: Redis) {
  try {
    await redis.quit()
    logger.info('Redis disconnected successfully')
  } catch (e) {
    logger.error({ error: e }, 'Redis disconnection failed')
  }
}

export async function redisPing(redis: Redis) {
  try {
    const result = await redis.ping()
    if (result === 'PONG') {
      logger.info('Redis connected successfully')
    } else {
      throw new Error(`Unexpected redis ping result: ${result}`)
    }
  } catch (e) {
    logger.fatal({ error: e }, 'Redis connection failed')
    process.exit(1)
  }
}
