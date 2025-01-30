import { initContract } from '@ts-rest/core'
import users from './routes/users'

const c = initContract()

export const contract = c.router({
  users,
})

export default contract
