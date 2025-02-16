import { serve } from '@hono/node-server'
import { logger } from '@/config/logger'

import env from '@/env'
import { postgresBuildUp, postgresTearDown } from '@/lib/postgres/index'
import appBuildUp from '@/app'
import { redisBuildUp, redisTeardown } from '@/lib/redis'

const POSTGRES_URL = env.POSTGRES_URL
const POSTGRES_MIGRATING = env.POSTGRES_MIGRATING

const REDIS_HOST = env.REDIS_HOST
const REDIS_PORT = env.REDIS_PORT
const REDIS_PASSWORD = env.REDIS_PASSWORD

const HOSTNAME = env.HOSTNAME
const PORT = env.PORT

async function serverBuildUp() {
  const { postgresPool, postgres } = postgresBuildUp(
    POSTGRES_URL,
    POSTGRES_MIGRATING
  )
  const redis = redisBuildUp(REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)

  const api = await appBuildUp(postgres, redis)

  const server = serve({
    fetch: api.fetch,
    hostname: HOSTNAME,
    port: PORT,
  })

  server.on('listening', () => {
    logger.info(`Server is listening on hostname:${HOSTNAME}, port:${PORT} `)
  })

  server.on('close', async () => {
    logger.fatal('Server is closing')
    await postgresTearDown(postgresPool)
    await redisTeardown(redis)
  })
}

serverBuildUp()
