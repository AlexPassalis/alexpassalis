import s from './index'
import contract from './../../../contract/src/main'
import userDB from './../db/db'

const usersRouter = s.router(contract.users, {
  get: async () => {
    return {
      status: 200,
      body: userDB,
    }
  },
})

export default usersRouter
