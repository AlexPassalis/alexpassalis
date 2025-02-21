import { describe, test, expect } from 'vitest'
import { nodemailerTest, emailInfoTest } from '@/test/setup'
import { faker } from '@faker-js/faker'
import { user, session, account, verification } from '@/lib/postgres/schema'
import { createAuthClient } from 'better-auth/react'
import { emailOTPClient } from 'better-auth/client/plugins'

describe('/api/auth', () => {
  const authClient = createAuthClient({
    baseURL: 'http://localhost:4000/api/auth',
    plugins: [emailOTPClient()],
  })

  test('/api/auth/email-otp/send-verification-otp - failure - A user tries to sign in using email OTP without having signed up first.', async () => {
    const email = faker.internet.email()
    await authClient.emailOtp.sendVerificationOtp(
      {
        email: email,
        type: 'sign-in',
      },
      {
        onSuccess: response => {
          expect(response.data).toEqual({ success: true })
        },
      }
    )
  })

  test('/api/auth/sign-up/email - success - A user tries to sign up using email', async () => {
    const email = faker.internet.email()
    const username = faker.internet.displayName()

    await authClient.signUp.email(
      {
        email: email,
        name: username,
        password: 'password',
      },
      {
        onSuccess: response => {
          expect(response.data).toMatchObject({
            token: null,
            user: {
              email: email.toLowerCase(),
              emailVerified: false,
              name: username,
            },
          })
        },
      }
    )

    console.log(nodemailerTest.getTestMessageUrl(emailInfoTest))
  })
})

// nodemailerTest.getTestMessageUrl()
