import Fastify from 'fastify'
import cors from '@fastify/cors'

import usersRouter from './routes/usersRouter.ts'
import userRouter from './routes/userRouter.ts'
import s from './routes/index.ts'

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: 'http://localhost:3000',
})

app.register(s.plugin(usersRouter))
app.register(s.plugin(userRouter))

export default app
