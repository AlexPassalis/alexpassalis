import s from './../index'
import contract from './../../../../contract/src/main'
import db from '../../db'

import usersTable from './users.schema'

import { v4 } from 'uuid'

const usersRouter = s.router(contract.users, {
  getAll: async () => {
    try {
      const users = await db.select().from(usersTable)
      return {
        status: 200,
        body: users,
      }
    } catch (error) {
      return {
        status: 400,
        body: { error: (error as Error).message },
      }
    }
  },

  create: async ({ body }) => {
    try {
      const newUser = {
        uid: v4(),
        email: body.email,
        username: body.username,
      }
      await db.insert(usersTable).values(newUser)
      return {
        status: 201,
        body: newUser,
      }
    } catch (error) {
      return {
        status: 400,
        body: { error: (error as Error).message },
      }
    }
  },
})

export default usersRouter
