import s from './index.ts'
import contract from '../../../../contract/src/index.ts'
import userDB from '../db/db.ts'

const usersRouter = s.router(contract.usersContract, {
  users: {
    async get() {
      return {
        status: 200,
        body: userDB,
      }
    },
  },
})

export default usersRouter
