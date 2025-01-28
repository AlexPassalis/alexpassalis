import 'dotenv/config'

const corsOptions = {
  origin: process.env.NEXT_JS_ORIGIN,
}

export default corsOptions
