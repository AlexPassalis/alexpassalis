import { describe, expect, test } from 'vitest'
import { apiTest, postgresTest, redisTest } from '@/test/setup'

describe('/api', () => {
  test('api/healthcheck - success', async () => {
    const res = await apiTest.request(
      '/api/healthcheck',
      {},
      { postgres: postgresTest, redis: redisTest }
    )
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('ok')
  })
})
