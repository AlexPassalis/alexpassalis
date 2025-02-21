import { ErrorBetterAuth } from '@/data/zod/error'
import { v4 as uuid } from 'uuid'
import env from '@/env'
import { logger } from '@/config/logger'
import { APIError } from 'better-auth/api'

export default function betterAuthError(
  error: ErrorBetterAuth,
  request?: Request,
  e?: unknown
) {
  const errId = uuid()
  const pathname = new URL(
    request?.url || `${env.HONO_BETTER_AUTH_URL}/unknown`
  ).pathname

  if (e) {
    logger.error(
      { err: e },
      `errId:${errId}, error:${error}, pathname:${pathname}`
    )
  }

  throw new APIError('INTERNAL_SERVER_ERROR', {
    errId: errId,
    error: error,
    pathname: pathname,
  })
}
