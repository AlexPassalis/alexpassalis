import { z } from 'zod'

const envSchema = z.object({ NEXT_PUBLIC_FASTIFY_BASE_URL: z.string() })

const { error, data } = envSchema.safeParse({
  NEXT_PUBLIC_FASTIFY_BASE_URL: process.env.NEXT_PUBLIC_FASTIFY_BASE_URL,
})

if (error) {
  console.error(error.flatten().fieldErrors)
  throw new Error('Invalid env variables')
}

const env = data
export default env
