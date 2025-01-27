const schema = {
  type: 'object',
  required: ['NEXT_JS_ORIGIN'],
  properties: {
    NEXT_JS_ORIGIN: { type: 'string' },
  },
}

const fastifyEnvOptions = {
  confKey: 'config',
  schema: schema,
  dotenv: true,
}

export default fastifyEnvOptions
