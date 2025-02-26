import dotenvFlow from 'dotenv-flow'
import fs from 'fs'
import { z } from 'zod'

dotenvFlow.config()

function readSecret(secret: string) {
  const secretPath = `/run/secrets/${secret}`
  return fs.existsSync(secretPath)
    ? fs.readFileSync(secretPath, 'utf-8').trim()
    : undefined
}

const stringBoolean = z.coerce
  .string()
  .transform(val => val === 'true')
  .default('false')

const expectedSchemaTypes = {} as {
  node_env:
    | z.ZodLiteral<'development'>
    | z.ZodLiteral<'test'>
    | z.ZodLiteral<'production'>
  hostname: z.ZodString
  port: z.ZodNumber
  log_level:
    | z.ZodLiteral<'debug'>
    | z.ZodLiteral<'silent'>
    | z.ZodLiteral<'info'>
  nextjs_origin: z.ZodString
  better_auth_url: z.ZodString
  redis_host: z.ZodString | z.ZodUndefined
  redis_port: ReturnType<typeof z.coerce.number> | z.ZodUndefined
  nodemailer_host: z.ZodString | z.ZodUndefined
  nodemailer_port: ReturnType<typeof z.coerce.number> | z.ZodUndefined
  nodemailer_secure: ReturnType<typeof z.coerce.boolean> | z.ZodUndefined
  postgres_url: z.ZodString | z.ZodUndefined
  postgres_migrating: typeof stringBoolean
  redis_password: z.ZodString | z.ZodUndefined
  hono_better_auth_secret: z.ZodString
  google_client_id: z.ZodString | z.ZodUndefined
  google_client_secret: z.ZodString | z.ZodUndefined
  nodemailer_auth_user: z.ZodString | z.ZodUndefined
  nodemailer_auth_pass: z.ZodString | z.ZodUndefined
}

switch (process.env.NODE_ENV) {
  case 'development':
    expectedSchemaTypes.node_env = z.literal('development')
    expectedSchemaTypes.hostname = z.string()
    expectedSchemaTypes.port = z.coerce.number()
    expectedSchemaTypes.log_level = z.literal('debug')
    expectedSchemaTypes.nextjs_origin = z.string()
    expectedSchemaTypes.better_auth_url = z.string()
    expectedSchemaTypes.postgres_migrating = stringBoolean
    expectedSchemaTypes.redis_host = z.string()
    expectedSchemaTypes.redis_port = z.coerce.number()
    expectedSchemaTypes.nodemailer_host = z.string()
    expectedSchemaTypes.nodemailer_port = z.coerce.number()
    expectedSchemaTypes.nodemailer_secure = z.coerce.boolean()

    expectedSchemaTypes.postgres_url = z.string()
    expectedSchemaTypes.redis_password = z.string()
    expectedSchemaTypes.hono_better_auth_secret = z.string()
    expectedSchemaTypes.google_client_id = z.string()
    expectedSchemaTypes.google_client_secret = z.string()
    expectedSchemaTypes.nodemailer_auth_user = z.string()
    expectedSchemaTypes.nodemailer_auth_pass = z.string()
    break
  case 'test':
    expectedSchemaTypes.node_env = z.literal('test')
    expectedSchemaTypes.hostname = z.string()
    expectedSchemaTypes.port = z.coerce.number()
    expectedSchemaTypes.log_level = z.literal('silent')
    expectedSchemaTypes.nextjs_origin = z.string()
    expectedSchemaTypes.better_auth_url = z.string()
    expectedSchemaTypes.hono_better_auth_secret = z.string()

    expectedSchemaTypes.postgres_url = z.undefined()
    expectedSchemaTypes.postgres_migrating = stringBoolean
    expectedSchemaTypes.redis_host = z.undefined()
    expectedSchemaTypes.redis_port = z.undefined()
    expectedSchemaTypes.redis_password = z.undefined()
    expectedSchemaTypes.nodemailer_host = z.undefined()
    expectedSchemaTypes.nodemailer_port = z.undefined()
    expectedSchemaTypes.nodemailer_secure = z.undefined()
    expectedSchemaTypes.nodemailer_auth_user = z.undefined()
    expectedSchemaTypes.nodemailer_auth_pass = z.undefined()

    expectedSchemaTypes.google_client_id = z.undefined()
    expectedSchemaTypes.google_client_secret = z.undefined()
    break
  case 'production':
    expectedSchemaTypes.node_env = z.literal('production')
    expectedSchemaTypes.hostname = z.string()
    expectedSchemaTypes.port = z.coerce.number()
    expectedSchemaTypes.log_level = z.literal('info')
    expectedSchemaTypes.nextjs_origin = z.string()
    expectedSchemaTypes.better_auth_url = z.string()
    expectedSchemaTypes.postgres_migrating = stringBoolean
    expectedSchemaTypes.redis_host = z.string()
    expectedSchemaTypes.redis_port = z.coerce.number()
    expectedSchemaTypes.nodemailer_host = z.string()
    expectedSchemaTypes.nodemailer_port = z.coerce.number()
    expectedSchemaTypes.nodemailer_secure = z.coerce.boolean()

    expectedSchemaTypes.postgres_url = z.string()
    expectedSchemaTypes.redis_password = z.string()
    expectedSchemaTypes.hono_better_auth_secret = z.string()
    expectedSchemaTypes.google_client_id = z.string()
    expectedSchemaTypes.google_client_secret = z.string()
    expectedSchemaTypes.nodemailer_auth_user = z.string()
    expectedSchemaTypes.nodemailer_auth_pass = z.string()
    break
  default:
    console.error(`Invalid NODE_ENV value: ${process.env.NODE_ENV}`)
    process.exit(1)
}

const envSchema = z.object({
  NODE_ENV: expectedSchemaTypes.node_env,
  HOSTNAME: expectedSchemaTypes.hostname,
  PORT: expectedSchemaTypes.port,
  LOG_LEVEL: expectedSchemaTypes.log_level,
  NEXTJS_ORIGIN: expectedSchemaTypes.nextjs_origin,
  BETTER_AUTH_URL: expectedSchemaTypes.better_auth_url,
  POSTGRES_MIGRATING: expectedSchemaTypes.postgres_migrating,
  REDIS_HOST: expectedSchemaTypes.redis_host,
  REDIS_PORT: expectedSchemaTypes.redis_port,
  NODEMAILER_HOST: expectedSchemaTypes.nodemailer_host,
  NODEMAILER_PORT: expectedSchemaTypes.nodemailer_port,
  NODEMAILER_SECURE: expectedSchemaTypes.nodemailer_secure,

  POSTGRES_URL: expectedSchemaTypes.postgres_url,
  REDIS_PASSWORD: expectedSchemaTypes.redis_password,
  HONO_BETTER_AUTH_SECRET: expectedSchemaTypes.hono_better_auth_secret,
  GOOGLE_CLIENT_ID: expectedSchemaTypes.google_client_id,
  GOOGLE_CLIENT_SECRET: expectedSchemaTypes.google_client_secret,
  NODEMAILER_AUTH_USER: expectedSchemaTypes.nodemailer_auth_user,
  NODEMAILER_AUTH_PASS: expectedSchemaTypes.nodemailer_auth_pass,
})

const { error, data } = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  HOSTNAME: process.env.HOSTNAME,
  PORT: process.env.PORT,
  LOG_LEVEL: process.env.LOG_LEVEL,
  NEXTJS_ORIGIN: process.env.NEXTJS_ORIGIN,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  POSTGRES_MIGRATING: process.env.POSTGRES_MIGRATING,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_PORT: process.env.NODEMAILER_PORT,
  NODEMAILER_SECURE: process.env.NODEMAILER_SECURE,

  POSTGRES_URL: readSecret('POSTGRES_URL'),
  REDIS_PASSWORD: readSecret('REDIS_PASSWORD'),
  HONO_BETTER_AUTH_SECRET:
    process.env.HONO_BETTER_AUTH_SECRET ||
    readSecret('HONO_BETTER_AUTH_SECRET'),
  NODEMAILER_AUTH_USER: readSecret('NODEMAILER_AUTH_USER'),
  NODEMAILER_AUTH_PASS: readSecret('NODEMAILER_AUTH_PASS'),
  GOOGLE_CLIENT_ID: readSecret('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: readSecret('GOOGLE_CLIENT_SECRET'),
})

if (error) {
  console.error('Invalid env variables :')
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

const env = data
export default env
