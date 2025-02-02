import { initTsrReactQuery } from '@ts-rest/react-query/v5'
import contract from './../../../ts_rest/src/main'
import env from './../../env'

export const tsr = initTsrReactQuery(contract, {
  baseUrl: env.NEXT_PUBLIC_FASTIFY_BASE_URL,
  baseHeaders: {
    'x-app-source': 'ts-rest',
  },
})
