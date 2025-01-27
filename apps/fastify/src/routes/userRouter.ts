import s from './index'
import contract from './../../../contract/src/main'
import userDB from '../db/db'

import { v4 } from 'uuid'

const userRouter = s.router(contract.user, {
  create: async ({ body }) => {
    const newUser = {
      uid: v4(),
      email: body.email,
      username: body.username,
    }
    userDB.push(newUser)
    return { status: 201, body: newUser }
  },
})

export default userRouter
