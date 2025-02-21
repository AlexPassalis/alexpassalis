import {
  errorBetterAuth,
  errorEmailSending,
  errorPasswordSignIn,
} from '@/data/zod/error'
import { logger } from '@/config/logger'
import { Postgres } from '@/lib/postgres/index'
import { betterAuth } from 'better-auth'
import env from '@/env'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { user, session, account, verification } from '@/lib/postgres/schema'
import betterAuthError from '@/lib/better-auth/utils/betterAuthError'
import { emailOTP } from 'better-auth/plugins'
import { EmailInfo, Transporter, sendEmailOTP } from '@/lib/nodemailer/index'

export default function newBetterAuth(
  postgres: Postgres,
  emailInfo: undefined | EmailInfo,
  nodemailer_auth_user: string,
  transporter: Transporter
) {
  const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.NEXT_JS_ORIGIN],
    onAPIError: {
      onError: e => {
        logger.error({ err: e }, errorBetterAuth)
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      requireEmailVerification: true,
      password: {
        hash: () => {
          return null
        },
        verify: () => {
          betterAuthError(errorPasswordSignIn)
        },
      },
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    plugins: [
      emailOTP({
        otpLength: 6,
        expiresIn: 300,
        disableSignUp: true,
        sendVerificationOnSignUp: false,
        sendVerificationOTP: async ({ email, otp, type }, request) => {
          if (type === 'sign-in') {
            try {
              emailInfo = await sendEmailOTP(
                otp,
                nodemailer_auth_user,
                email,
                transporter
              )
            } catch (e) {
              betterAuthError(errorEmailSending, request, e)
            }
          }
        },
      }),
    ],
    database: drizzleAdapter(postgres, {
      provider: 'pg',
      schema: {
        user: user,
        session: session,
        account: account,
        verification: verification,
      },
    }),
  })
  return auth
}
