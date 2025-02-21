import { serve } from '@hono/node-server'
import { logger } from '@/config/logger'
import env from '@/env'
import { postgresBuildUp, postgresTearDown } from '@/lib/postgres/index'
import appBuildUp from '@/app'
import { redisBuildUp, redisTeardown } from '@/lib/redis'
import {
  EmailInfo,
  newNodemailer,
  Nodemailer,
  nodemailerTransporterBuildUp,
} from '@/lib/nodemailer/index'

export async function serverBuildUp(
  postgres_url: string,
  postgres_migrating: boolean,
  redis_host: string,
  redis_port: number,
  redis_password: string,
  nodemailer: Nodemailer,
  nodemailer_host: string,
  nodemailer_port: number,
  nodemailer_secure: boolean,
  nodemailer_auth_user: string,
  nodemailer_auth_pass: string,
  hono_hostname: string,
  hono_port: number
) {
  const { postgresPool, postgres } = postgresBuildUp(
    postgres_url,
    postgres_migrating
  )
  const redis = redisBuildUp(redis_host, redis_port, redis_password)

  const transporter = nodemailerTransporterBuildUp(
    nodemailer,
    nodemailer_host,
    nodemailer_port,
    nodemailer_secure,
    nodemailer_auth_user,
    nodemailer_auth_pass
  )

  let emailInfo: undefined | EmailInfo
  const api = await appBuildUp(
    postgres,
    redis,
    emailInfo,
    nodemailer_auth_user,
    transporter
  )

  const server = serve({
    fetch: api.fetch,
    hostname: hono_hostname,
    port: hono_port,
  })

  server.on('listening', () => {
    logger.info(
      `Server is listening on hostname:${hono_hostname}, port:${hono_port}`
    )
  })

  server.on('close', async () => {
    logger.fatal('Server is closing')
    await postgresTearDown(postgresPool)
    await redisTeardown(redis)
  })

  return { postgres, redis, emailInfo, api, server }
}

export type Server = Awaited<ReturnType<typeof serverBuildUp>>['server']

if (process.env.NODE_ENV !== 'test') {
  const nodemailer = newNodemailer()
  serverBuildUp(
    env.POSTGRES_URL,
    env.POSTGRES_MIGRATING,
    env.REDIS_HOST,
    env.REDIS_PORT,
    env.REDIS_PASSWORD,
    nodemailer,
    env.NODEMAILER_HOST,
    env.NODEMAILER_PORT,
    env.NODEMAILER_SECURE,
    env.NODEMAILER_AUTH_USER,
    env.NODEMAILER_AUTH_PASS,
    env.HONO_HOSTNAME,
    env.HONO_PORT
  )
}
