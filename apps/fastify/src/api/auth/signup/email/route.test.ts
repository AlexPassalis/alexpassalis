import { test, expect, describe } from 'vitest'
import { faker } from '@faker-js/faker'

describe('POST /api/auth/signup/email', () => {
  test('fail', async () => {
    const email = faker.internet.email()
    console.log(email)
  })
})
