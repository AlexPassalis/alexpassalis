import s from './index.ts'
import contract from './../../../contract/src/main.ts'
import userDB from '../db/db.ts'

const usersRouter = s.router(contract.users, {
  get: async () => {
    return {
      status: 200,
      body: userDB,
    }
  },
})

export default usersRouter
