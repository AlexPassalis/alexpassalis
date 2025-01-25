import { initContract } from '@ts-rest/core'
import users from './routes/users.ts'
import user from './routes/user.ts'

const c = initContract()

export const contract = c.router({
  users,
  user,
})

export default contract
