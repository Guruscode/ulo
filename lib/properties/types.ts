import type { UserRole } from '@/lib/auth/types'

export type PropertyCurrency = 'USD' | 'NGN'
export type PropertyPricingPeriod =
  | 'sale'
  | 'monthly'
  | '6-months'
  | 'annually'
  | '2-years'
  | '5-years'
  | 'per-day'
  | '3-days'
  | 'per-week'
  | 'per-month'
export type PropertyType = 'For Sale' | 'For Rent' | 'Land' | 'Shortlet'
export type PropertyPosterType = 'Agent' | 'Landlord' | 'Dealer' | 'Owner'
export type PropertyVerificationStatus = 'not_requested' | 'requested' | 'verified'
export type PropertyApprovalStatus = 'draft' | 'pending_review' | 'approved' | 'rejected'
export type PropertyStatus = 'active' | 'sold' | 'pending'
export type PropertyScope = 'public' | 'mine' | 'admin'

export interface PropertyImage {
  url: string
}

export interface PropertyRecord {
  id: string
  title: string
  location: string
  fullAddress: string
  estate: string | null
  latitude: number | null
  longitude: number | null
  priceValue: number
  currency: PropertyCurrency
  pricingPeriod: PropertyPricingPeriod
  type: PropertyType
  listedBy: PropertyPosterType
  bedrooms: number
  bathrooms: number
  features: string[]
  imageUrls: string[]
  videoUrl: string | null
  referenceCode: string
  documentInfo: string | null
  contactName: string
  contactPhone: string
  contactEmail: string
  verificationStatus: PropertyVerificationStatus
  approvalStatus: PropertyApprovalStatus
  status: PropertyStatus
  disclaimerAccepted: boolean
  description: string
  featured: boolean
  createdByUserId: string
  createdByName: string | null
  createdByEmail: string | null
  createdByRole: UserRole | null
  approvedByUserId: string | null
  approvedAt: string | null
  rejectionReason: string | null
  viewsCount?: number
  isSaved?: boolean
  createdAt: string
  updatedAt: string
}

export interface PropertyListFilters {
  search?: string
  type?: string
  status?: string
  approvalStatus?: string
  limit?: number
}

export interface PropertyUpsertInput {
  title: string
  location: string
  fullAddress: string
  estate?: string | null
  latitude?: number | null
  longitude?: number | null
  priceValue: number
  currency: PropertyCurrency
  pricingPeriod: PropertyPricingPeriod
  type: PropertyType
  listedBy: PropertyPosterType
  bedrooms: number
  bathrooms: number
  features: string[]
  imageUrls: string[]
  videoUrl?: string | null
  referenceCode?: string | null
  documentInfo?: string | null
  contactName: string
  contactPhone: string
  contactEmail: string
  verificationStatus?: PropertyVerificationStatus
  disclaimerAccepted: boolean
  description: string
  status: PropertyStatus
  featured?: boolean
}
