import { initContract } from '@ts-rest/core'
import { z } from 'zod'

const c = initContract()

export const auth = c.router({
  signUpCredentials: {
    method: 'POST',
    path: '/api/auth/signUp/credentials',
    body: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    responses: {
      201: z.object({}),
    },
  },
})
