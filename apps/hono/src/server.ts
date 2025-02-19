import { serve } from '@hono/node-server'
import { logger } from '@/config/logger'
import env from '@/env'
import { postgresBuildUp, postgresTearDown } from '@/lib/postgres/index'
import appBuildUp from '@/app'
import { redisBuildUp, redisTeardown } from '@/lib/redis'
import {
  newNodemailer,
  nodemailerTransporterBuildUp,
} from '@/lib/nodemailer/index'

export function serverBuildUp(
  postgres_url: string,
  postgres_migrating: boolean,
  redis_host: string,
  redis_port: number,
  redis_password: string,
  nodemailer_host: string,
  nodemailer_port: number,
  nodemailer_secure: boolean,
  nodemailer_auth_user: string,
  nodemailer_auth_password: string
) {
  const { postgresPool, postgres } = postgresBuildUp(
    postgres_url,
    postgres_migrating
  )
  const redis = redisBuildUp(redis_host, redis_port, redis_password)

  const nodemailer = newNodemailer()
  const transporter = nodemailerTransporterBuildUp(
    nodemailer,
    nodemailer_host,
    nodemailer_port,
    nodemailer_secure,
    nodemailer_auth_user,
    nodemailer_auth_password
  )

  return { postgresPool, postgres, redis, nodemailer, transporter }
}

async function serverStart(hostname: string, port: number) {
  const { postgresPool, postgres, redis, transporter } = serverBuildUp(
    env.POSTGRES_URL,
    env.POSTGRES_MIGRATING,
    env.REDIS_HOST,
    env.REDIS_PORT,
    env.REDIS_PASSWORD,
    env.NODEMAILER_HOST,
    env.NODEMAILER_PORT,
    env.NODEMAILER_SECURE,
    env.NODEMAILER_AUTH_USER,
    env.NODEMAILER_AUTH_PASSWORD
  )

  const api = await appBuildUp(
    postgres,
    redis,
    env.NODEMAILER_AUTH_USER,
    transporter
  )

  const server = serve({
    fetch: api.fetch,
    hostname: hostname,
    port: port,
  })

  server.on('listening', () => {
    logger.info(`Server is listening on hostname:${hostname}, port:${port}`)
  })

  server.on('close', async () => {
    logger.fatal('Server is closing')
    await postgresTearDown(postgresPool)
    await redisTeardown(redis)
  })
}

if (process.env.NODE_ENV !== 'test') {
  serverStart(env.HOSTNAME, env.PORT)
}
