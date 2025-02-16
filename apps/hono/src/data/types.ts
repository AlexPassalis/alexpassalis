import { PinoLogger } from 'hono-pino'
import { Postgres } from '@/lib/postgres'
import Redis from 'ioredis'
import newHono from '@/utils/newHono'

export interface apiBindings {
  Variables: {
    logger: PinoLogger
  }
  Bindings: {
    postgres: Postgres
    redis: Redis
  }
}

export type HonoInstance = ReturnType<typeof newHono>
