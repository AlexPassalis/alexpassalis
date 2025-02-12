import { sql } from 'drizzle-orm'
import { pgSchema, text, uuid, timestamp } from 'drizzle-orm/pg-core'

export const authSchema = pgSchema('auth')

export const usersTable = authSchema.table('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  picture: text('picture'),
  provider: text('provider').notNull(),
  provider_id: text('provider_id'),
  created_at: timestamp('created_at').notNull(),
  updated_at: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => sql`(NOW())`),
})
