import { relations } from 'drizzle-orm'
import { user, session, account } from './auth'
import { subscription } from './subscriptions'
import { generation } from './generations'

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  subscription: one(subscription),
  generations: many(generation),
}))

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
}))

export const generationRelations = relations(generation, ({ one }) => ({
  user: one(user, {
    fields: [generation.userId],
    references: [user.id],
  }),
}))
