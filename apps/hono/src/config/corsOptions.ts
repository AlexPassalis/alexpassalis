import env from '@/env'

const corsOptions = {
  origin: env.NEXT_JS_ORIGIN,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}

export default corsOptions
