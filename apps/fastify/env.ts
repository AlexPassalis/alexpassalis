import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import path from 'path'
import { z, ZodError } from 'zod'

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev'
expand(config({ path: path.resolve(process.cwd(), envFile) }))

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

  DB_MIGRATING: stringBoolean,
})

let _env

try {
  _env = envSchema.parse(process.env)
} catch (error) {
  if (error instanceof ZodError) {
    const message = error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(`Invalid env variables:\n${message}`)
  } else {
    throw error
  }
}

const env = _env
export default env
