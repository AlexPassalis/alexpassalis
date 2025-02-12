import { config } from 'dotenv-flow'
import { expand } from 'dotenv-expand'
import { z } from 'zod'

const envFile = config()
expand(envFile)

const stringBoolean = z.coerce
  .string()
  .transform(val => val === 'true')
  .default('false')

const envSchema = z.object({
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),

  POSTGRES_URL: z.string(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PASSWORD: z.string(),

  NEXT_JS_ORIGIN: z.string(),

  FASTIFY_PORT: z.coerce.number(),
  FASTIFY_HOST: z.string(),

  JWT_SECRET: z.string(),

  NODEMAILER_HOST: z.string(),
  NODEMAILER_PORT: z.coerce.number(),
  NODEMAILER_SECURE: z.coerce.boolean(),
  NODEMAILER_AUTH_USER: z.string(),
  NODEMAILER_AUTH_PASS: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  POSTGRES_MIGRATING: stringBoolean,
})

const { error, data } = envSchema.safeParse({
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,

  POSTGRES_URL: process.env.POSTGRES_URL,

  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  NEXT_JS_ORIGIN: process.env.NEXT_JS_ORIGIN,

  FASTIFY_PORT: process.env.FASTIFY_PORT,
  FASTIFY_HOST: process.env.FASTIFY_HOST,

  JWT_SECRET: process.env.JWT_SECRET,

  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_PORT: process.env.NODEMAILER_PORT,
  NODEMAILER_SECURE: process.env.NODEMAILER_SECURE,
  NODEMAILER_AUTH_USER: process.env.NODEMAILER_AUTH_USER,
  NODEMAILER_AUTH_PASS: process.env.NODEMAILER_AUTH_PASS,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  POSTGRES_MIGRATING: process.env.POSTGRES_MIGRATING,
})

if (error) {
  console.error(error.flatten().fieldErrors)
  throw new Error('Invalid env variables')
}

const env = data
export default env
