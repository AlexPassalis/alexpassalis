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

  DATABASE_URL: z.string(),

  NEXT_JS_ORIGIN: z.string(),

  PORT: z.coerce.number(),
  HOST: z.string(),

  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),

  DB_MIGRATING: stringBoolean,
})

const { error, data } = envSchema.safeParse({
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,

  DATABASE_URL: process.env.DATABASE_URL,

  NEXT_JS_ORIGIN: process.env.NEXT_JS_ORIGIN,

  PORT: process.env.PORT,
  HOST: process.env.HOST,

  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

  DB_MIGRATING: process.env.DB_MIGRATING,
})

if (error) {
  console.error(error.flatten().fieldErrors)
  throw new Error('Invalid env variables')
}

const env = data
export default env
