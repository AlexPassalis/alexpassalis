import { config } from 'dotenv-flow'
import { expand } from 'dotenv-expand'
import { z } from 'zod'

const envFile = config()
expand(envFile)

const stringBoolean = z.coerce
  .string()
  .transform(val => val === 'true')
  .default('false')

const envSchemaTest = z.object({
  NODE_ENV: z.literal('test'),
  HOSTNAME: z.string(),
  PORT: z.coerce.number(),
  NEXT_JS_ORIGIN: z.string(),
  BETTER_AUTH_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),

  LOG_LEVEL: z.literal('silent'),
})

const envSchema = z.object({
  NODE_ENV: z.string(),
  HOSTNAME: z.string(),
  PORT: z.coerce.number(),
  NEXT_JS_ORIGIN: z.string(),
  BETTER_AUTH_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),

  LOG_LEVEL: z.literal('debug'),

  POSTGRES_URL: z.string(),
  POSTGRES_MIGRATING: stringBoolean,

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PASSWORD: z.string(),

  NODEMAILER_HOST: z.string(),
  NODEMAILER_PORT: z.coerce.number(),
  NODEMAILER_SECURE: z.coerce.boolean(),
  NODEMAILER_AUTH_USER: z.string(),
  NODEMAILER_AUTH_PASS: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
})

const { error, data } =
  process.env.NODE_ENV === 'test'
    ? envSchemaTest.safeParse({
        NODE_ENV: process.env.NODE_ENV,
        HOSTNAME: process.env.HOSTNAME,
        PORT: process.env.PORT,
        NEXT_JS_ORIGIN: process.env.NEXT_JS_ORIGIN,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

        LOG_LEVEL: process.env.LOG_LEVEL,
      })
    : envSchema.safeParse({
        NODE_ENV: process.env.NODE_ENV,
        HOSTNAME: process.env.HOSTNAME,
        PORT: process.env.PORT,
        NEXT_JS_ORIGIN: process.env.NEXT_JS_ORIGIN,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

        LOG_LEVEL: process.env.LOG_LEVEL,

        POSTGRES_URL: process.env.POSTGRES_URL,
        POSTGRES_MIGRATING: process.env.POSTGRES_MIGRATING,

        REDIS_HOST: process.env.REDIS_HOST,
        REDIS_PORT: process.env.REDIS_PORT,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,

        NODEMAILER_HOST: process.env.NODEMAILER_HOST,
        NODEMAILER_PORT: process.env.NODEMAILER_PORT,
        NODEMAILER_SECURE: process.env.NODEMAILER_SECURE,
        NODEMAILER_AUTH_USER: process.env.NODEMAILER_AUTH_USER,
        NODEMAILER_AUTH_PASS: process.env.NODEMAILER_AUTH_PASS,

        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      })

if (error) {
  console.error('Invalid env variables :')
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

const env = data
export default env
