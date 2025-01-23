import { initContract } from '@ts-rest/core'
import { z } from 'zod'

const c = initContract()

export const userContract = c.router({
  user: {
    create: {
      method: 'POST',
      path: '/api/user/create',
      body: z.object({
        email: z.string().email(),
        username: z.string().min(6).max(12),
      }),
      responses: {
        201: z.object({
          uid: z.string(),
          email: z.string().email(),
          username: z.string().min(6).max(12),
        }),
        400: z.object({ error: z.string() }),
      },
    },
  },
})

export default userContract
