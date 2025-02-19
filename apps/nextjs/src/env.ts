import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string(),
})

const { error, data } = envSchema.safeParse({
  NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
})

if (error) {
  console.error('Invalid env variables :')
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

const env = data
export default env
