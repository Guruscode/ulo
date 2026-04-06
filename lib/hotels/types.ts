import type { UserRole } from '@/lib/auth/types'

export type HotelApprovalStatus = 'draft' | 'pending_review' | 'approved' | 'rejected'
export type HotelStatus = 'active' | 'inactive' | 'pending'
export type HotelBookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled'
export type HotelBookingPaymentStatus = 'unpaid' | 'payment_submitted' | 'payment_verified'

export interface HotelRoomRecord {
  id: string
  hotelId: string
  name: string
  description: string
  priceValue: number
  priceLabel: string
  maxGuests: number
  bedType: string
  size: string
  amenities: string[]
  images: string[]
  available: boolean
  createdAt: string
  updatedAt: string
}

export interface HotelRecord {
  id: string
  name: string
  slug: string
  location: string
  description: string
  rating: number
  reviewCount: number
  priceValue: number
  priceLabel: string
  image: string
  images: string[]
  amenities: string[]
  contactPhone: string
  contactEmail: string
  contactAddress: string
  bankName: string
  bankAccountName: string
  bankAccountNumber: string
  rooms: HotelRoomRecord[]
  approvalStatus: HotelApprovalStatus
  status: HotelStatus
  featured: boolean
  createdByUserId: string
  createdByName: string | null
  createdByEmail: string | null
  createdByRole: UserRole | null
  approvedByUserId: string | null
  approvedAt: string | null
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
}

export interface HotelBookingRecord {
  id: string
  hotelId: string
  hotelName: string
  roomId: string
  roomName: string
  guestName: string
  guestEmail: string
  guestPhone: string
  guestOrigin: string
  adults: number
  children: number
  checkInDate: string
  checkOutDate: string
  departureTime: string | null
  status: HotelBookingStatus
  paymentStatus: HotelBookingPaymentStatus
  paymentReceiptUrl: string | null
  paymentSubmittedAt: string | null
  createdByUserId: string | null
  createdAt: string
  updatedAt: string
}

export interface HotelUpsertRoomInput {
  id?: string | null
  name: string
  description: string
  priceValue: number
  bedType: string
  size: string
  maxGuests: number
  amenities: string[]
  images: string[]
  available: boolean
}

export interface HotelUpsertInput {
  name: string
  location: string
  description: string
  rating: number
  reviewCount: number
  priceValue: number
  images: string[]
  amenities: string[]
  contactPhone: string
  contactEmail: string
  contactAddress: string
  bankName: string
  bankAccountName: string
  bankAccountNumber: string
  featured?: boolean
  status: HotelStatus
  rooms: HotelUpsertRoomInput[]
}

export interface HotelBookingInput {
  roomId: string
  guestName: string
  guestEmail: string
  guestPhone: string
  guestOrigin: string
  adults: number
  children: number
  checkInDate: string
  checkOutDate: string
  departureTime?: string | null
}
