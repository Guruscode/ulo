import { randomUUID } from 'crypto'
import type { ResultSet } from '@libsql/client'

import type {
  HotelApprovalStatus,
  HotelBookingRecord,
  HotelBookingStatus,
  HotelRecord,
  HotelRoomRecord,
  HotelStatus,
  HotelUpsertInput,
  HotelUpsertRoomInput,
} from '@/lib/hotels/types'
import { getDbClient } from '@/lib/server/db/client'
import { initializeDatabase } from '@/lib/server/db/init'

function parseArray(value: unknown) {
  if (!value) return [] as string[]
  try {
    const parsed = JSON.parse(String(value))
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : []
  } catch (_error) {
    return []
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatHotelPrice(priceValue: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(priceValue)
}

function mapRoomRow(row: ResultSet['rows'][number]): HotelRoomRecord {
  return {
    id: String(row.id),
    hotelId: String(row.hotel_id),
    name: String(row.name),
    description: String(row.description),
    priceValue: Number(row.price_value),
    priceLabel: formatHotelPrice(Number(row.price_value)),
    maxGuests: Number(row.max_guests),
    bedType: String(row.bed_type),
    size: String(row.size),
    amenities: parseArray(row.amenities_json),
    images: parseArray(row.images_json),
    available: Number(row.available) === 1,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function mapHotelRow(row: ResultSet['rows'][number], rooms: HotelRoomRecord[]): HotelRecord {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    location: String(row.location),
    description: String(row.description),
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    priceValue: Number(row.price_value),
    priceLabel: formatHotelPrice(Number(row.price_value)),
    image: parseArray(row.images_json)[0] || '',
    images: parseArray(row.images_json),
    amenities: parseArray(row.amenities_json),
    contactPhone: String(row.contact_phone),
    contactEmail: String(row.contact_email),
    contactAddress: String(row.contact_address),
    bankName: String(row.bank_name ?? ''),
    bankAccountName: String(row.bank_account_name ?? ''),
    bankAccountNumber: String(row.bank_account_number ?? ''),
    approvalStatus: row.approval_status as HotelApprovalStatus,
    status: row.status as HotelStatus,
    featured: Number(row.featured) === 1,
    createdByUserId: String(row.created_by_user_id),
    createdByName: row.created_by_name ? String(row.created_by_name) : null,
    createdByEmail: row.created_by_email ? String(row.created_by_email) : null,
    createdByRole: row.created_by_role ? String(row.created_by_role) as HotelRecord['createdByRole'] : null,
    approvedByUserId: row.approved_by_user_id ? String(row.approved_by_user_id) : null,
    approvedAt: row.approved_at ? String(row.approved_at) : null,
    rejectionReason: row.rejection_reason ? String(row.rejection_reason) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    rooms,
  }
}

async function getRoomsByHotelIds(hotelIds: string[]) {
  if (hotelIds.length === 0) {
    return new Map<string, HotelRoomRecord[]>()
  }

  const db = getDbClient()
  const placeholders = hotelIds.map(() => '?').join(', ')
  const result = await db.execute({
    sql: `
      SELECT *
      FROM hotel_rooms
      WHERE hotel_id IN (${placeholders})
      ORDER BY created_at DESC
    `,
    args: hotelIds,
  })

  const grouped = new Map<string, HotelRoomRecord[]>()

  for (const row of result.rows) {
    const room = mapRoomRow(row)
    const rooms = grouped.get(room.hotelId) || []
    rooms.push(room)
    grouped.set(room.hotelId, rooms)
  }

  return grouped
}

export async function listHotels(scope: 'public' | 'mine' | 'admin', filters?: { search?: string; status?: string; approvalStatus?: string }, userId?: string) {
  await initializeDatabase()

  const db = getDbClient()
  const conditions: string[] = []
  const args: Array<string | number> = []

  if (scope === 'public') {
    conditions.push(`h.approval_status = 'approved'`)
    conditions.push(`h.status = 'active'`)
  }

  if (scope === 'mine') {
    conditions.push(`h.created_by_user_id = ?`)
    args.push(userId ?? '')
  }

  if (filters?.search) {
    conditions.push(`(LOWER(h.name) LIKE ? OR LOWER(h.location) LIKE ? OR LOWER(h.slug) LIKE ?)`)
    const search = `%${filters.search.toLowerCase()}%`
    args.push(search, search, search)
  }

  if (filters?.status && filters.status !== 'all') {
    conditions.push(`h.status = ?`)
    args.push(filters.status)
  }

  if (filters?.approvalStatus && filters.approvalStatus !== 'all') {
    conditions.push(`h.approval_status = ?`)
    args.push(filters.approvalStatus)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await db.execute({
    sql: `
      SELECT
        h.*,
        u.name AS created_by_name,
        u.email AS created_by_email,
        u.role AS created_by_role
      FROM hotels h
      LEFT JOIN users u ON u.id = h.created_by_user_id
      ${whereClause}
      ORDER BY
        CASE WHEN h.approval_status = 'pending_review' THEN 0 ELSE 1 END,
        h.featured DESC,
        h.created_at DESC
    `,
    args,
  })

  const hotelIds = result.rows.map((row) => String(row.id))
  const roomsByHotelId = await getRoomsByHotelIds(hotelIds)

  return result.rows.map((row) => mapHotelRow(row, roomsByHotelId.get(String(row.id)) || []))
}

export async function findHotelById(id: string) {
  await initializeDatabase()

  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT
        h.*,
        u.name AS created_by_name,
        u.email AS created_by_email,
        u.role AS created_by_role
      FROM hotels h
      LEFT JOIN users u ON u.id = h.created_by_user_id
      WHERE h.id = ?
      LIMIT 1
    `,
    args: [id],
  })

  const row = result.rows[0]
  if (!row) return null

  const roomsByHotelId = await getRoomsByHotelIds([id])
  return mapHotelRow(row, roomsByHotelId.get(id) || [])
}

export async function createHotel(input: {
  id: string
  slug: string
  createdByUserId: string
  approvalStatus: HotelApprovalStatus
  approvedByUserId?: string | null
  approvedAt?: string | null
  rejectionReason?: string | null
  featured: boolean
} & HotelUpsertInput) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `
      INSERT INTO hotels (
        id, slug, name, location, description, rating, review_count, price_value,
        images_json, amenities_json, contact_phone, contact_email, contact_address,
        bank_name, bank_account_name, bank_account_number,
        approval_status, status, featured, created_by_user_id, approved_by_user_id,
        approved_at, rejection_reason, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [
      input.id,
      input.slug,
      input.name,
      input.location,
      input.description,
      input.rating,
      input.reviewCount,
      input.priceValue,
      JSON.stringify(input.images),
      JSON.stringify(input.amenities),
      input.contactPhone,
      input.contactEmail,
      input.contactAddress,
      input.bankName,
      input.bankAccountName,
      input.bankAccountNumber,
      input.approvalStatus,
      input.status,
      input.featured ? 1 : 0,
      input.createdByUserId,
      input.approvedByUserId ?? null,
      input.approvedAt ?? null,
      input.rejectionReason ?? null,
    ],
  })

  await replaceHotelRooms(input.id, input.rooms)
  return findHotelById(input.id)
}

export async function updateHotel(
  id: string,
  input: HotelUpsertInput & {
    slug: string
    approvalStatus: HotelApprovalStatus
    approvedByUserId?: string | null
    approvedAt?: string | null
    rejectionReason?: string | null
  }
) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE hotels
      SET
        slug = ?,
        name = ?,
        location = ?,
        description = ?,
        rating = ?,
        review_count = ?,
        price_value = ?,
        images_json = ?,
        amenities_json = ?,
        contact_phone = ?,
        contact_email = ?,
        contact_address = ?,
        bank_name = ?,
        bank_account_name = ?,
        bank_account_number = ?,
        approval_status = ?,
        status = ?,
        featured = ?,
        approved_by_user_id = ?,
        approved_at = ?,
        rejection_reason = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      input.slug,
      input.name,
      input.location,
      input.description,
      input.rating,
      input.reviewCount,
      input.priceValue,
      JSON.stringify(input.images),
      JSON.stringify(input.amenities),
      input.contactPhone,
      input.contactEmail,
      input.contactAddress,
      input.bankName,
      input.bankAccountName,
      input.bankAccountNumber,
      input.approvalStatus,
      input.status,
      input.featured ? 1 : 0,
      input.approvedByUserId ?? null,
      input.approvedAt ?? null,
      input.rejectionReason ?? null,
      id,
    ],
  })

  await replaceHotelRooms(id, input.rooms)
  return findHotelById(id)
}

export async function replaceHotelRooms(hotelId: string, rooms: HotelUpsertRoomInput[]) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `DELETE FROM hotel_rooms WHERE hotel_id = ?`,
    args: [hotelId],
  })

  for (const room of rooms) {
    await db.execute({
      sql: `
        INSERT INTO hotel_rooms (
          id, hotel_id, name, description, price, price_value, max_guests, bed_type, size,
          amenities_json, images_json, available, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [
        room.id ?? randomUUID(),
        hotelId,
        room.name,
        room.description,
        formatHotelPrice(room.priceValue),
        room.priceValue,
        room.maxGuests,
        room.bedType,
        room.size,
        JSON.stringify(room.amenities),
        JSON.stringify(room.images),
        room.available ? 1 : 0,
      ],
    })
  }
}

export async function deleteHotel(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({ sql: `DELETE FROM hotel_bookings WHERE hotel_id = ?`, args: [id] })
  await db.execute({ sql: `DELETE FROM hotel_rooms WHERE hotel_id = ?`, args: [id] })
  await db.execute({ sql: `DELETE FROM hotels WHERE id = ?`, args: [id] })
}

export async function updateHotelApproval(id: string, input: { approvalStatus: HotelApprovalStatus; approvedByUserId?: string | null; approvedAt?: string | null; rejectionReason?: string | null }) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE hotels
      SET approval_status = ?, approved_by_user_id = ?, approved_at = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [input.approvalStatus, input.approvedByUserId ?? null, input.approvedAt ?? null, input.rejectionReason ?? null, id],
  })
  return findHotelById(id)
}

export async function createHotelBooking(input: {
  id: string
  hotelId: string
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
  status: HotelBookingStatus
  paymentStatus?: HotelBookingRecord['paymentStatus']
  paymentReceiptUrl?: string | null
  paymentSubmittedAt?: string | null
  createdByUserId?: string | null
}) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `
      INSERT INTO hotel_bookings (
        id, hotel_id, room_id, guest_name, guest_email, guest_phone, guest_origin, adults, children,
        check_in_date, check_out_date, departure_time, status, payment_status, payment_receipt_url,
        payment_submitted_at, created_by_user_id, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [
      input.id,
      input.hotelId,
      input.roomId,
      input.guestName,
      input.guestEmail,
      input.guestPhone,
      input.guestOrigin,
      input.adults,
      input.children,
      input.checkInDate,
      input.checkOutDate,
      input.departureTime ?? null,
      input.status,
      input.paymentStatus ?? 'unpaid',
      input.paymentReceiptUrl ?? null,
      input.paymentSubmittedAt ?? null,
      input.createdByUserId ?? null,
    ],
  })
  return findHotelBookingById(input.id)
}

export async function findHotelBookingById(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT
        b.*,
        h.name AS hotel_name,
        r.name AS room_name
      FROM hotel_bookings b
      INNER JOIN hotels h ON h.id = b.hotel_id
      INNER JOIN hotel_rooms r ON r.id = b.room_id
      WHERE b.id = ?
      LIMIT 1
    `,
    args: [id],
  })
  const row = result.rows[0]
  if (!row) return null
  return {
    id: String(row.id),
    hotelId: String(row.hotel_id),
    hotelName: String(row.hotel_name),
    roomId: String(row.room_id),
    roomName: String(row.room_name),
    guestName: String(row.guest_name),
    guestEmail: String(row.guest_email),
    guestPhone: String(row.guest_phone),
    guestOrigin: String(row.guest_origin),
    adults: Number(row.adults),
    children: Number(row.children),
    checkInDate: String(row.check_in_date),
    checkOutDate: String(row.check_out_date),
    departureTime: row.departure_time ? String(row.departure_time) : null,
    status: row.status as HotelBookingStatus,
    paymentStatus: String(row.payment_status ?? 'unpaid') as HotelBookingRecord['paymentStatus'],
    paymentReceiptUrl: row.payment_receipt_url ? String(row.payment_receipt_url) : null,
    paymentSubmittedAt: row.payment_submitted_at ? String(row.payment_submitted_at) : null,
    createdByUserId: row.created_by_user_id ? String(row.created_by_user_id) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  } satisfies HotelBookingRecord
}

export async function listHotelBookings(scope: 'mine' | 'admin', userId?: string) {
  await initializeDatabase()
  const db = getDbClient()
  const conditions: string[] = []
  const args: Array<string | number> = []

  if (scope === 'mine') {
    conditions.push(`h.created_by_user_id = ?`)
    args.push(userId ?? '')
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await db.execute({
    sql: `
      SELECT
        b.*,
        h.name AS hotel_name,
        r.name AS room_name
      FROM hotel_bookings b
      INNER JOIN hotels h ON h.id = b.hotel_id
      INNER JOIN hotel_rooms r ON r.id = b.room_id
      ${whereClause}
      ORDER BY b.created_at DESC
    `,
    args,
  })

  return result.rows.map((row) => ({
    id: String(row.id),
    hotelId: String(row.hotel_id),
    hotelName: String(row.hotel_name),
    roomId: String(row.room_id),
    roomName: String(row.room_name),
    guestName: String(row.guest_name),
    guestEmail: String(row.guest_email),
    guestPhone: String(row.guest_phone),
    guestOrigin: String(row.guest_origin),
    adults: Number(row.adults),
    children: Number(row.children),
    checkInDate: String(row.check_in_date),
    checkOutDate: String(row.check_out_date),
    departureTime: row.departure_time ? String(row.departure_time) : null,
    status: row.status as HotelBookingStatus,
    paymentStatus: String(row.payment_status ?? 'unpaid') as HotelBookingRecord['paymentStatus'],
    paymentReceiptUrl: row.payment_receipt_url ? String(row.payment_receipt_url) : null,
    paymentSubmittedAt: row.payment_submitted_at ? String(row.payment_submitted_at) : null,
    createdByUserId: row.created_by_user_id ? String(row.created_by_user_id) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }))
}

export async function updateHotelBookingStatus(id: string, status: HotelBookingStatus) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `UPDATE hotel_bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    args: [status, id],
  })
  return findHotelBookingById(id)
}

export async function updateHotelBookingPaymentReceipt(
  id: string,
  input: {
    receiptUrl: string
    paymentStatus?: HotelBookingRecord['paymentStatus']
  }
) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE hotel_bookings
      SET
        payment_receipt_url = ?,
        payment_status = ?,
        payment_submitted_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [input.receiptUrl, input.paymentStatus ?? 'payment_submitted', id],
  })
  return findHotelBookingById(id)
}

export async function countHotels(userId?: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: userId
      ? `SELECT COUNT(*) AS count FROM hotels WHERE created_by_user_id = ?`
      : `SELECT COUNT(*) AS count FROM hotels`,
    args: userId ? [userId] : [],
  })
  return Number(result.rows[0]?.count ?? 0)
}

export async function slugExists(slug: string, excludeId?: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `SELECT id FROM hotels WHERE slug = ? ${excludeId ? 'AND id != ?' : ''} LIMIT 1`,
    args: excludeId ? [slug, excludeId] : [slug],
  })
  return Boolean(result.rows[0])
}
