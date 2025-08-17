'use server'

import { Polar } from '@polar-sh/sdk'
import { env } from '@/env'

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: env.NODE_ENV === 'production' ? 'production' : 'sandbox',
})

export async function createCustomerSafely(
  userId: string,
  email: string,
  name?: string
) {
  try {
    // First, try to find existing customer by external_id
    const existingCustomers = await polarClient.customers.list({
      externalId: userId,
    })

    if (existingCustomers.result && existingCustomers.result.items.length > 0) {
      console.log('✅ Customer already exists', {
        userId,
        customerId: existingCustomers.result.items[0].id,
      })
      return existingCustomers.result.items[0]
    }

    // If no existing customer, create new one
    const newCustomer = await polarClient.customers.create({
      externalId: userId,
      email,
      name: name || email.split('@')[0],
    })

    console.log('✅ Customer created successfully', {
      userId,
      customerId: newCustomer.id,
    })
    return newCustomer
  } catch (error: any) {
    console.error('❌ Error creating customer:', error)

    // If customer already exists with the external_id, try to find and return it
    if (
      error.message?.includes('external_id') ||
      error.message?.includes('Customer external ID')
    ) {
      try {
        const existingCustomers = await polarClient.customers.list({
          externalId: userId,
        })

        if (
          existingCustomers.result &&
          existingCustomers.result.items.length > 0
        ) {
          console.log('✅ Found existing customer after creation error', {
            userId,
            customerId: existingCustomers.result.items[0].id,
          })
          return existingCustomers.result.items[0]
        }
      } catch (searchError) {
        console.error('❌ Error searching for existing customer:', searchError)
      }
    }

    throw error
  }
}
