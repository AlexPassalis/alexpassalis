import pino from 'pino'
import { pinoLogger as hono } from 'hono-pino'
import env from '@/env'
import { v4 as uuid } from 'uuid'

export const logger = pino({
  level: env.HONO_LOG_LEVEL,
  serializers: {
    req: req => ({
      method: req.method,
      url: req.url,
      host: req.headers?.host,
    }),
    res: res => ({
      statusCode: res.status,
    }),
  },
})

export function pinoLogger() {
  return hono({
    pino: logger,
    http: {
      reqId: () => uuid(),
    },
  })
}
