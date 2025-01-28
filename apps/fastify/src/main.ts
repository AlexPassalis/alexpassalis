import Fastify from 'fastify'

import fastifyEnv from '@fastify/env'
import fastifyEnvOptions from './conf/fastifyEnvOptions'

import cors from '@fastify/cors'
import corsOptions from './conf/corsOptions'

import s from './routes/index'
import usersRouter from './routes/usersRouter'
import userRouter from './routes/userRouter'

const app = Fastify({ logger: true })

async function start() {
  await app.register(fastifyEnv, fastifyEnvOptions)
  await app.register(cors, corsOptions)
}
start()

app.register(s.plugin(usersRouter))
app.register(s.plugin(userRouter))

export default app
