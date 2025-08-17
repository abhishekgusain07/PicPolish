import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const platformEnum = pgEnum('platform', [
  'screenshot',
  'twitter',
  'youtube',
])

export const generation = pgTable('generation', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  platform: platformEnum('platform').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  metadata: text('metadata'), // Optional field for storing additional data like tweet ID, video URL, etc.
})
