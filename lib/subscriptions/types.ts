export type BillingInterval = 'month' | 'year'
export type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'cancelled'
export type SubscriptionPaymentMethod = 'paystack' | 'account'

export interface SubscriptionPlanRecord {
  id: string
  name: string
  slug: string
  description: string
  priceAmount: number
  currency: 'NGN'
  billingInterval: BillingInterval
  propertyLimit: number
  hotelLimit: number
  features: string[]
  isFree: boolean
  isActive: boolean
  paystackPlanCode: string | null
  createdAt: string
  updatedAt: string
}

export interface UserSubscriptionRecord {
  id: string
  userId: string
  userName: string | null
  userEmail: string | null
  planId: string
  planName: string
  status: SubscriptionStatus
  amount: number
  currency: 'NGN'
  billingInterval: BillingInterval
  paymentProvider: 'paystack' | 'manual' | 'system'
  paymentReference: string | null
  paystackAccessCode: string | null
  paystackAuthorizationUrl: string | null
  startsAt: string | null
  endsAt: string | null
  createdAt: string
  updatedAt: string
}
