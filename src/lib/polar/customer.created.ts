'use server'

import type { WebhookCustomerCreatedPayload } from '@polar-sh/sdk/models/components/webhookcustomercreatedpayload.js'

export async function handleCustomerCreated(
  payload: WebhookCustomerCreatedPayload
) {
  console.log('🔔 WEBHOOK: customer.created received', {
    customerId: payload.data.id,
    externalId: payload.data.externalId,
    email: payload.data.email,
    timestamp: new Date().toISOString(),
  })

  const { data: customer } = payload
  try {
    console.log('✅ Customer Created Successfully', {
      customerId: customer.id,
      externalId: customer.externalId,
      email: customer.email,
    })

    // Additional customer processing logic can be added here
    // For example, updating user preferences, sending welcome emails, etc.
  } catch (error) {
    console.error('❌ Error processing customer creation webhook:', error)
    // Don't throw - webhook should not fail even if post-processing fails
  }
}
