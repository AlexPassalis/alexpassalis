import { z } from 'zod'

export const typeEmail = z.string().email()
export const typeUsername = z.string().min(4).max(20)
export const typeOTP = z.string().length(6)

export interface User {
  id: string
  email: string
  emailVerified: boolean
  name: string
  createdAt: Date
  updatedAt: Date
  image?: string | null | undefined | undefined
}
