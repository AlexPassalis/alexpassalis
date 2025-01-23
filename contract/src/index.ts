import { initContract } from '@ts-rest/core'
import userContract from './routes/user.contract.ts'
import usersContract from './routes/users.contract.ts'

const c = initContract()

export const contract = c.router({
  userContract,
  usersContract,
})

export default contract
