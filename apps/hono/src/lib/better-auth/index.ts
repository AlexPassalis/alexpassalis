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
import { Transporter, sendEmailOTP } from '@/lib/nodemailer/index'
import { EmailInfo } from '@/server'

export default function newBetterAuth(
  postgres: Postgres,
  emailInfo: EmailInfo,
  nodemailer_auth_user: string,
  transporter: Transporter
) {
  const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.HONO_BETTER_AUTH_SECRET,
    trustedOrigins: [env.NEXTJS_ORIGIN],
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
        hash: (() => {
          return null
        }) as unknown as (password: string) => Promise<string>, // return null no matter what password is provided.
        verify: (() => {
          betterAuthError(errorPasswordSignIn)
          return
        }) as unknown as (data: {
          hash: string
          password: string
        }) => Promise<boolean>, // throw an error when someone tries to log in using password
      },
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
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
              emailInfo.info = await sendEmailOTP(
                otp,
                nodemailer_auth_user,
                email,
                transporter
              )
              emailInfo.otp = otp
            } catch (e) {
              betterAuthError(errorEmailSending, request, e)
            }
          } else {
            betterAuthError(errorEmailSending, request) // this needs to change to another type of error
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
