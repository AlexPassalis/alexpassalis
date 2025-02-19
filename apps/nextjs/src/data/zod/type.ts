import { z } from 'zod'

export const typeEmail = z.string().email()
export const typeUsername = z.string().min(4).max(20)
export const typeOTP = z.string().length(6)
