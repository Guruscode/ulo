import type { SubscriptionPlanRecord } from '@/lib/subscriptions/types'

export const seededSubscriptionPlans: Array<
  Pick<
    SubscriptionPlanRecord,
    | 'name'
    | 'slug'
    | 'description'
    | 'priceAmount'
    | 'currency'
    | 'billingInterval'
    | 'propertyLimit'
    | 'hotelLimit'
    | 'features'
    | 'isFree'
    | 'isActive'
  >
> = [
  {
    name: 'Free',
    slug: 'free',
    description: 'Starter access with limited listing capacity.',
    priceAmount: 0,
    currency: 'NGN',
    billingInterval: 'month',
    propertyLimit: 1,
    hotelLimit: 0,
    features: ['1 property listing', 'No hotel listings', 'Basic dashboard access'],
    isFree: true,
    isActive: true,
  },
  {
    name: 'Basic',
    slug: 'basic',
    description: 'For small real-estate operators.',
    priceAmount: 25000,
    currency: 'NGN',
    billingInterval: 'month',
    propertyLimit: 10,
    hotelLimit: 1,
    features: ['10 property listings', '1 hotel listing', 'Priority email support'],
    isFree: false,
    isActive: true,
  },
  {
    name: 'Premium',
    slug: 'premium',
    description: 'For active agents and hospitality operators.',
    priceAmount: 75000,
    currency: 'NGN',
    billingInterval: 'month',
    propertyLimit: 100,
    hotelLimit: 10,
    features: ['100 property listings', '10 hotel listings', 'Featured placement support'],
    isFree: false,
    isActive: true,
  },
]
