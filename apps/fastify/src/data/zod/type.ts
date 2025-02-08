import { z } from 'zod'

export const typeEmail = z.string().email()
