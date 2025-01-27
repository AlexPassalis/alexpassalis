import Fastify from 'fastify'

import fastifyEnv from '@fastify/env'
import fastifyEnvOptions from './conf/fastifyEnvOptions.ts'

import cors from '@fastify/cors'

import s from './routes/index.ts'
import usersRouter from './routes/usersRouter.ts'
import userRouter from './routes/userRouter.ts'

const app = Fastify({ logger: true })

await app.register(fastifyEnv, fastifyEnvOptions)

await app.register(cors, {
  origin: process.env.NEXT_JS_ORIGIN,
})

app.register(s.plugin(usersRouter))
app.register(s.plugin(userRouter))

export default app
