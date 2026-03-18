import { apiRequest } from '@/lib/client/api-client'
import type { SubscriptionPlanRecord, UserSubscriptionRecord } from '@/lib/subscriptions/types'

type PlanPayload = {
  name: string
  slug: string
  description: string
  priceAmount: number
  billingInterval: 'month' | 'year'
  propertyLimit: number
  hotelLimit: number
  features: string[]
  isFree: boolean
  isActive: boolean
  paystackPlanCode?: string | null
}

export function listSubscriptionPlansRequest() {
  return apiRequest<{ plans: SubscriptionPlanRecord[] }>('/api/subscription-plans', { method: 'GET' })
}

export function createSubscriptionPlanRequest(payload: PlanPayload) {
  return apiRequest<{ plan: SubscriptionPlanRecord }>('/api/subscription-plans', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateSubscriptionPlanRequest(id: string, payload: PlanPayload) {
  return apiRequest<{ plan: SubscriptionPlanRecord }>(`/api/subscription-plans/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function listSubscriptionsRequest() {
  return apiRequest<{ subscriptions: UserSubscriptionRecord[] }>('/api/subscriptions', { method: 'GET' })
}

export function getCurrentSubscriptionRequest() {
  return apiRequest<{
    plan: SubscriptionPlanRecord
    subscription: UserSubscriptionRecord | null
  }>('/api/subscriptions/current', { method: 'GET' })
}

export function initializeSubscriptionCheckoutRequest(planId: string) {
  return apiRequest<{ authorizationUrl: string; reference: string }>('/api/subscriptions/checkout', {
    method: 'POST',
    body: JSON.stringify({ planId }),
  })
}

export function verifySubscriptionRequest(reference: string) {
  return apiRequest<{ subscription: UserSubscriptionRecord }>('/api/subscriptions/verify', {
    method: 'POST',
    body: JSON.stringify({ reference }),
  })
}

export function updateAdminSubscriptionRequest(
  id: string,
  status: 'active' | 'expired' | 'cancelled'
) {
  return apiRequest<{ subscription: UserSubscriptionRecord }>(`/api/admin/subscriptions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
