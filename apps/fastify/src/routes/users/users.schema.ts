import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

const usersTable = pgTable('users', {
  uid: uuid('uid').notNull().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 12 }).notNull().unique(),
})

export default usersTable
