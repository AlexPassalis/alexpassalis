import env from '../../env'

const fastifyCorsOptions = {
  origin: env.NEXT_JS_ORIGIN,
  methods: ['GET', 'POST'],
}

export default fastifyCorsOptions
