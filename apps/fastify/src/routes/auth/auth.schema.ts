import { pgSchema, text, uuid } from 'drizzle-orm/pg-core'

export const authSchema = pgSchema('auth')

export const usersTable = authSchema.table('users', {
  uid: uuid('uid').primaryKey(),
  email: text('email').notNull().unique(),
})
