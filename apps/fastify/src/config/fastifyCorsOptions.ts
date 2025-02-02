import env from './../../env'

const fastifyCorsOptions = {
  origin: [env.NEXT_JS_ORIGIN, env.BETTER_AUTH_URL],
  methods: ['GET', 'POST'],
}

export default fastifyCorsOptions
