import type { FastifyCookieOptions } from '@fastify/cookie'

const fastifyCookieOptions = {
  parseOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 60,
    path: '/',
  },
} as FastifyCookieOptions

export default fastifyCookieOptions
