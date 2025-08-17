import { createTRPCRouter } from '../init'
import { exampleRouter } from './example'
import { billingRouter } from './billing'
import { usageRouter } from './usage'

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  billing: billingRouter,
  usage: usageRouter,
})

export type AppRouter = typeof appRouter
