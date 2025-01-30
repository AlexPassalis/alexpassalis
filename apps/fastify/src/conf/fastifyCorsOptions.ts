import env from '../../env'

const fastifyCorsOptions = {
  origin: env.NEXT_JS_ORIGIN,
}

export default fastifyCorsOptions
