import type {
  PropertyApprovalStatus,
  PropertyCurrency,
  PropertyPosterType,
  PropertyStatus,
  PropertyType,
  PropertyVerificationStatus,
} from '@/lib/properties/types'

export type Property = {
  id: string
  title: string
  location: string
  fullAddress?: string
  price: string
  priceValue: number
  currency: PropertyCurrency
  bedrooms: number
  bathrooms: number
  sqft: string
  image: string
  images?: string[]
  type: PropertyType
  listedBy: PropertyPosterType
  views?: number
  isSaved?: boolean
  badges?: string[]
  originalPrice?: string
  discount?: string
  estate?: string
  description?: string
  features?: string[]
  yearBuilt?: number | null
  videoUrl?: string | null
  referenceCode?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  verificationStatus?: PropertyVerificationStatus
  approvalStatus?: PropertyApprovalStatus
  status?: PropertyStatus
  createdAt?: string
  updatedAt?: string
}

export type Estate = {
  name: string
  slug: string
  image: string
  location: string
}

export type QuickType = 'All' | 'Buy' | 'Sell' | 'Rent' | 'Shortlet'
export type CurrencyFilter = 'Any' | 'USD' | 'NGN'
