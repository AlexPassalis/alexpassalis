import { initContract } from '@ts-rest/core'
import { z } from 'zod'

const c = initContract()

export const users = c.router({
  get: {
    method: 'GET',
    path: '/api/users/get',
    responses: {
      200: z.array(
        z.object({
          uid: z.string(),
          email: z.string(),
          username: z.string(),
        })
      ),
      400: z.object({ error: z.string() }),
    },
  },
})

export default users
