import { initContract } from '@ts-rest/core'
import users from './routes/users'
import user from './routes/user'

const c = initContract()

export const contract = c.router({
  users,
  user,
})

export default contract
