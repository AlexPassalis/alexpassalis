import { initTsrReactQuery } from '@ts-rest/react-query/v5'
import contract from './../../../contract/src/main.ts'

export const tsr = initTsrReactQuery(contract, {
  baseUrl: 'http://localhost:4000',
  baseHeaders: {
    'x-app-source': 'ts-rest',
  },
})
