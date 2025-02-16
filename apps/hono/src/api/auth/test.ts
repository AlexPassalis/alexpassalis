import { describe, test, expect } from 'vitest'
import { HonoInstance } from '@/data/types'
import appBuildUp from '@/app'
import { postgres, redis } from '@/test/setup'

describe('GET /api/auth/signup', async () => {
  let api: HonoInstance

  test('success', async () => {
    api = await appBuildUp(postgres, redis)
    const res = await api.request('/api/healthcheck', {}, { postgres, redis })
    expect(res.status).toBe(200)
  })

  test('success', async () => {
    const res = await api.request('/api/auth/signup', {}, { postgres, redis })
    expect(res.status).toBe(200)
  })

  // test('fail - body invalid', async () => {})
})
