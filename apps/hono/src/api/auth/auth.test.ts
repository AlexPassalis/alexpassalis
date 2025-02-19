import { describe, test, expect } from 'vitest'
import { apiTest, postgresTest, redisTest, nodemailerTest } from '@/test/setup'
import { faker } from '@faker-js/faker'
import { user, session, account, verification } from '@/lib/postgres/schema'

describe('/api/auth', () => {
  test('/api/auth/email-otp/send-verification-otp - failure - A user tries to sign in using email OTP without having signed up first.', async () => {
    const email = faker.internet.email()
    const res = await apiTest.request(
      'api/auth/email-otp/send-verification-otp',
      {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          type: 'sign-in',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      { postgres: postgresTest, redis: redisTest }
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })

    expect((await postgresTest.select().from(user)).length).toBe(0)
    expect((await postgresTest.select().from(session)).length).toBe(0)
    expect((await postgresTest.select().from(account)).length).toBe(0)
    expect((await postgresTest.select().from(verification)).length).toBe(0)


    nodemailerTest.getTestMessageUrl()
  })
})
