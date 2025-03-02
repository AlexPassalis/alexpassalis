import { createAuthClient } from 'better-auth/client'
import { emailOTPClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: 'https://alexpassalis.com/api/auth',
  plugins: [emailOTPClient()],
})
