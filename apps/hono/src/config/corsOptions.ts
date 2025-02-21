import env from '@/env'

const corsOptions = {
  origin: env.HONO_NEXTJS_ORIGIN,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}

export default corsOptions
