import { randomUUID } from 'crypto'
import { z } from 'zod'

import type { AuthUser } from '@/lib/auth/types'
import type {
  HotelApprovalStatus,
  HotelBookingInput,
  HotelBookingStatus,
  HotelRecord,
  HotelUpsertInput,
} from '@/lib/hotels/types'
import { ApiError } from '@/lib/server/http/api-error'
import { sendHotelApprovalEmail, sendHotelBookingEmails, sendHotelBookingReceiptEmails, sendHotelCreatedEmails } from '@/lib/server/mail/notifications'
import { createUserNotification } from '@/lib/server/notifications/service'
import { assertListingCapacity } from '@/lib/server/subscriptions/service'
import {
  countHotels,
  createHotel,
  createHotelBooking,
  findHotelBookingById,
  deleteHotel,
  findHotelById,
  listHotelBookings,
  listHotels,
  slugExists,
  updateHotel,
  updateHotelApproval,
  updateHotelBookingPaymentReceipt,
  updateHotelBookingStatus,
} from '@/lib/server/hotels/repository'
import { seededHotels } from '@/lib/server/hotels/seed-data'

const roomSchema = z.object({
  id: z.string().trim().optional().nullable(),
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  priceValue: z.number().int().positive(),
  maxGuests: z.number().int().min(1),
  bedType: z.string().trim().min(2),
  size: z.string().trim().min(2),
  amenities: z.array(z.string().trim().min(1)).min(1),
  images: z.array(z.string().trim().url()).min(1),
  available: z.boolean(),
})

const hotelSchema = z.object({
  name: z.string().trim().min(3),
  location: z.string().trim().min(2),
  description: z.string().trim().min(20),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  priceValue: z.number().int().positive(),
  images: z.array(z.string().trim().url()).min(4).max(4),
  amenities: z.array(z.string().trim().min(1)).min(1),
  contactPhone: z.string().trim().min(7),
  contactEmail: z.string().trim().email(),
  contactAddress: z.string().trim().min(5),
  bankName: z.string().trim().min(2),
  bankAccountName: z.string().trim().min(2),
  bankAccountNumber: z.string().trim().min(6),
  featured: z.boolean().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
  rooms: z.array(roomSchema).min(1),
})

const bookingSchema = z.object({
  roomId: z.string().trim().min(1),
  guestName: z.string().trim().min(2),
  guestEmail: z.string().trim().email(),
  guestPhone: z.string().trim().min(7),
  guestOrigin: z.string().trim().min(2),
  adults: z.number().int().min(1),
  children: z.number().int().min(0),
  checkInDate: z.string().trim().min(1),
  checkOutDate: z.string().trim().min(1),
  departureTime: z.string().trim().optional().nullable(),
})

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function resolveUniqueSlug(name: string, excludeId?: string) {
  const base = slugify(name)
  let candidate = base
  let suffix = 1

  while (await slugExists(candidate, excludeId)) {
    suffix += 1
    candidate = `${base}-${suffix}`
  }

  return candidate
}

function ensureHotelAccess(hotel: HotelRecord | null, actor?: AuthUser | null) {
  if (!hotel) {
    throw new ApiError(404, 'HOTEL_NOT_FOUND', 'Hotel not found.')
  }

  if (!actor) {
    if (hotel.approvalStatus !== 'approved' || hotel.status !== 'active') {
      throw new ApiError(404, 'HOTEL_NOT_FOUND', 'Hotel not found.')
    }
    return hotel
  }

  if (actor.role === 'admin' || hotel.createdByUserId === actor.id) {
    return hotel
  }

  if (hotel.approvalStatus === 'approved' && hotel.status === 'active') {
    return hotel
  }

  throw new ApiError(403, 'FORBIDDEN', 'You do not have access to this hotel.')
}

function ensureCanManageHotels(actor: AuthUser) {
  if (actor.role === 'admin') return

  if (actor.accountType === 'user' || actor.accountType === 'landlord') {
    throw new ApiError(403, 'HOTEL_LISTING_NOT_ALLOWED', 'Your account type cannot manage hotels.')
  }

  if (actor.status !== 'active') {
    throw new ApiError(403, 'ACCOUNT_DISABLED', 'Your account is disabled.')
  }

  if (actor.approvalStatus !== 'approved') {
    throw new ApiError(403, 'ACCOUNT_PENDING_APPROVAL', 'Your account must be approved before managing hotels.')
  }
}

export async function seedHotelsIfNeeded() {
  const currentCount = await countHotels()
  if (currentCount > 0) return

  for (const hotel of seededHotels) {
    const slug = await resolveUniqueSlug(hotel.name)
    await createHotel({
      id: randomUUID(),
      slug,
      createdByUserId: 'system-seed',
      approvalStatus: 'approved',
      approvedByUserId: 'system-seed',
      approvedAt: new Date().toISOString(),
      rejectionReason: null,
      featured: hotel.featured ?? false,
      ...hotel,
    })
  }
}

export async function listHotelsForScope(scope: 'public' | 'mine' | 'admin', actor?: AuthUser | null, filters?: { search?: string; status?: string; approvalStatus?: string }) {
  if (scope === 'mine') {
    if (!actor) throw new ApiError(401, 'UNAUTHORIZED', 'You are not signed in.')
    return listHotels('mine', filters, actor.id)
  }
  if (scope === 'admin') {
    if (!actor || actor.role !== 'admin') throw new ApiError(403, 'FORBIDDEN', 'Admin access is required.')
    return listHotels('admin', filters)
  }
  return listHotels('public', filters)
}

export async function getHotelForActor(id: string, actor?: AuthUser | null) {
  const hotel = await findHotelById(id)
  return ensureHotelAccess(hotel, actor)
}

export async function createHotelForActor(input: unknown, actor: AuthUser) {
  ensureCanManageHotels(actor)
  await assertListingCapacity(actor, 'hotel', await countHotels(actor.id))
  const parsed = hotelSchema.safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the hotel form fields.', parsed.error.flatten())
  }

  const slug = await resolveUniqueSlug(parsed.data.name)
  const approvalStatus: HotelApprovalStatus = actor.role === 'admin' ? 'approved' : 'pending_review'
  const hotel = await createHotel({
    id: randomUUID(),
    slug,
    createdByUserId: actor.id,
    approvalStatus,
    approvedByUserId: actor.role === 'admin' ? actor.id : null,
    approvedAt: actor.role === 'admin' ? new Date().toISOString() : null,
    rejectionReason: null,
    featured: parsed.data.featured ?? false,
    ...parsed.data,
  })

  if (!hotel) throw new ApiError(500, 'HOTEL_CREATE_FAILED', 'Unable to create hotel.')
  await sendHotelCreatedEmails(hotel)
  await createUserNotification({
    userId: actor.id,
    title: 'Hotel submitted',
    message:
      approvalStatus === 'approved'
        ? `"${hotel.name}" is now live on ULO.`
        : `"${hotel.name}" was submitted and is pending admin review.`,
    href: '/dashboard/hotels',
  })
  return hotel
}

export async function updateHotelForActor(id: string, input: unknown, actor: AuthUser) {
  ensureCanManageHotels(actor)
  const parsed = hotelSchema.safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the hotel form fields.', parsed.error.flatten())
  }

  const existing = await findHotelById(id)
  if (!existing) throw new ApiError(404, 'HOTEL_NOT_FOUND', 'Hotel not found.')
  if (actor.role !== 'admin' && existing.createdByUserId !== actor.id) {
    throw new ApiError(403, 'FORBIDDEN', 'You do not have access to update this hotel.')
  }

  const slug = await resolveUniqueSlug(parsed.data.name, id)
  const nextApprovalStatus: HotelApprovalStatus =
    actor.role === 'admin'
      ? existing.approvalStatus
      : existing.approvalStatus === 'approved' || existing.approvalStatus === 'rejected'
        ? 'pending_review'
        : existing.approvalStatus

  const hotel = await updateHotel(id, {
    slug,
    approvalStatus: actor.role === 'admin' ? existing.approvalStatus : nextApprovalStatus,
    approvedByUserId: actor.role === 'admin' ? existing.approvedByUserId : null,
    approvedAt: actor.role === 'admin' ? existing.approvedAt : null,
    rejectionReason: actor.role === 'admin' ? existing.rejectionReason : null,
    featured: parsed.data.featured ?? false,
    ...parsed.data,
  })

  if (!hotel) throw new ApiError(500, 'HOTEL_UPDATE_FAILED', 'Unable to update hotel.')
  return hotel
}

export async function deleteHotelForActor(id: string, actor: AuthUser) {
  const existing = await findHotelById(id)
  if (!existing) throw new ApiError(404, 'HOTEL_NOT_FOUND', 'Hotel not found.')
  if (actor.role !== 'admin' && existing.createdByUserId !== actor.id) {
    throw new ApiError(403, 'FORBIDDEN', 'You do not have access to delete this hotel.')
  }
  await deleteHotel(id)
}

export async function setHotelApprovalForAdmin(id: string, input: unknown, actor: AuthUser) {
  if (actor.role !== 'admin') throw new ApiError(403, 'FORBIDDEN', 'Admin access is required.')
  const parsed = z.object({
    approvalStatus: z.enum(['approved', 'rejected', 'pending_review']),
    rejectionReason: z.string().trim().optional().nullable(),
  }).safeParse(input)
  if (!parsed.success) throw new ApiError(400, 'VALIDATION_ERROR', 'Please provide a valid approval update.', parsed.error.flatten())
  const hotel = await updateHotelApproval(id, {
    approvalStatus: parsed.data.approvalStatus,
    approvedByUserId: parsed.data.approvalStatus === 'approved' ? actor.id : null,
    approvedAt: parsed.data.approvalStatus === 'approved' ? new Date().toISOString() : null,
    rejectionReason: parsed.data.approvalStatus === 'rejected' ? parsed.data.rejectionReason || 'Rejected by admin.' : null,
  })
  if (!hotel) throw new ApiError(500, 'HOTEL_APPROVAL_FAILED', 'Unable to update hotel approval.')
  if (parsed.data.approvalStatus === 'approved' || parsed.data.approvalStatus === 'rejected') {
    await sendHotelApprovalEmail(hotel)
    await createUserNotification({
      userId: hotel.createdByUserId,
      title: parsed.data.approvalStatus === 'approved' ? 'Hotel approved' : 'Hotel rejected',
      message:
        parsed.data.approvalStatus === 'approved'
          ? `"${hotel.name}" has been approved and is now visible on the platform.`
          : `"${hotel.name}" was rejected.${hotel.rejectionReason ? ` Reason: ${hotel.rejectionReason}` : ''}`,
      href: '/dashboard/hotels',
    })
  }
  return hotel
}

export async function createBookingForHotel(hotelId: string, input: unknown, actor?: AuthUser | null) {
  const parsed = bookingSchema.safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the booking form fields.', parsed.error.flatten())
  }

  const hotel = await findHotelById(hotelId)
  if (!hotel || hotel.approvalStatus !== 'approved' || hotel.status !== 'active') {
    throw new ApiError(404, 'HOTEL_NOT_FOUND', 'Hotel not found.')
  }

  const room = hotel.rooms.find((item) => item.id === parsed.data.roomId)
  if (!room) throw new ApiError(404, 'ROOM_NOT_FOUND', 'Room not found.')

  const booking = await createHotelBooking({
    id: randomUUID(),
    hotelId,
    status: 'pending',
    createdByUserId: actor?.id ?? null,
    ...parsed.data,
  })

  if (!booking) throw new ApiError(500, 'BOOKING_CREATE_FAILED', 'Unable to create booking.')
  await sendHotelBookingEmails({
    hotel,
    booking: {
      ...booking,
      guestEmail: parsed.data.guestEmail,
    },
  })
  return booking
}

export async function listBookingsForScope(scope: 'mine' | 'admin', actor: AuthUser) {
  if (scope === 'admin') {
    if (actor.role !== 'admin') throw new ApiError(403, 'FORBIDDEN', 'Admin access is required.')
    return listHotelBookings('admin')
  }
  return listHotelBookings('mine', actor.id)
}

export async function updateBookingStatusForActor(id: string, status: HotelBookingStatus, actor: AuthUser) {
  const parsedStatus = z.enum(['pending', 'confirmed', 'checked_in', 'completed', 'cancelled']).safeParse(status)
  if (!parsedStatus.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please provide a valid booking status.')
  }

  const existing = await findHotelBookingById(id)
  if (!existing) throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found.')

  if (actor.role !== 'admin') {
    const hotel = await findHotelById(existing.hotelId)
    if (!hotel || hotel.createdByUserId !== actor.id) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have access to update this booking.')
    }
  }

  const booking = await updateHotelBookingStatus(id, parsedStatus.data)
  if (!booking) throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found.')
  return booking
}

export async function submitHotelBookingReceipt(id: string, input: unknown) {
  const parsed = z.object({
    receiptUrl: z.string().trim().url('Please upload a valid receipt file.'),
  }).safeParse(input)

  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please provide a valid receipt upload.', parsed.error.flatten())
  }

  const existing = await findHotelBookingById(id)
  if (!existing) throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found.')
  const hotel = await findHotelById(existing.hotelId)
  if (!hotel) throw new ApiError(404, 'HOTEL_NOT_FOUND', 'Hotel not found.')

  const booking = await updateHotelBookingPaymentReceipt(id, {
    receiptUrl: parsed.data.receiptUrl,
    paymentStatus: 'payment_submitted',
  })

  if (!booking) throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found.')
  await sendHotelBookingReceiptEmails({ hotel, booking })
  return booking
}
