import { PinoLogger } from 'hono-pino'
import { Postgres } from '@/lib/postgres'
import Redis from 'ioredis'

export interface apiBindings {
  Variables: {
    logger: PinoLogger
  }
  Bindings: {
    postgres: Postgres
    redis: Redis
  }
}
