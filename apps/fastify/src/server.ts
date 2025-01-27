import app from './main.ts'

app.listen(
  { port: Number(process.env.PORT), host: '0.0.0.0' },
  (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  }
)
