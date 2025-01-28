import { initTsrReactQuery } from '@ts-rest/react-query/v5'
import contract from './../../../contract/src/main'

console.log(process.env.NEXT_PUBLIC_FASTIFY_BASE_URL)

export const tsr = initTsrReactQuery(contract, {
  baseUrl: process.env.NEXT_PUBLIC_FASTIFY_BASE_URL as string,
  baseHeaders: {
    'x-app-source': 'ts-rest',
  },
})
