import s from './index.ts'
import contract from '../../../../contract/src/index.ts'
import { v4 } from 'uuid'
import userDB from '../db/db.ts'

const userRouter = s.router(contract.userContract, {
  user: {
    async create({ body }) {
      const newUser = {
        uid: v4(),
        email: body.email,
        username: body.username,
      }
      userDB.push(newUser)
      return { status: 201, body: newUser }
    },
  },
})

export default userRouter
