import { initContract } from '@ts-rest/core'
import { z } from 'zod'

const c = initContract()

export const users = c.router({
  getAll: {
    method: 'GET',
    path: '/api/users',
    responses: {
      200: z.array(
        z.object({
          uid: z.string().uuid(),
          email: z.string().email(),
          username: z.string().min(6).max(12),
        })
      ),
      400: z.object({ error: z.string() }),
    },
  },
  create: {
    method: 'POST',
    path: '/api/users',
    body: z.object({
      email: z.string().email(),
      username: z.string().min(6).max(12),
    }),
    responses: {
      201: z.object({
        uid: z.string().uuid(),
        email: z.string().email(),
        username: z.string().min(6).max(12),
      }),
      400: z.object({ error: z.string() }),
    },
  },
})

export default users
