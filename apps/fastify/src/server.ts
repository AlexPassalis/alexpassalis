import app from './main'

app.listen(
  { port: Number(process.env.PORT) || 4000, host: '0.0.0.0' },
  (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  }
)
