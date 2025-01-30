import env from '../env'
import app, { serverSetup } from './main'

async function startServer() {
  try {
    await serverSetup()
    await app.listen({
      port: env.PORT,
      host: env.HOST,
    })
  } catch (error) {
    app.log.error(error, 'Server failed to start')
    process.exit(1)
  }
}

startServer()
