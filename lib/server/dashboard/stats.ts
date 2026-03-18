import { getDbClient } from '@/lib/server/db/client'
import { initializeDatabase } from '@/lib/server/db/init'

export async function getUserDashboardStats(userId: string) {
  await initializeDatabase()
  const db = getDbClient()
  const [properties, hotels, bookings] = await Promise.all([
    db.execute({
      sql: `
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN approval_status = 'approved' THEN 1 ELSE 0 END) AS approved,
          SUM(CASE WHEN approval_status = 'pending_review' THEN 1 ELSE 0 END) AS pending
        FROM properties
        WHERE created_by_user_id = ?
      `,
      args: [userId],
    }),
    db.execute({
      sql: `
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN approval_status = 'approved' THEN 1 ELSE 0 END) AS approved
        FROM hotels
        WHERE created_by_user_id = ?
      `,
      args: [userId],
    }),
    db.execute({
      sql: `
        SELECT COUNT(*) AS total
        FROM hotel_bookings b
        INNER JOIN hotels h ON h.id = b.hotel_id
        WHERE h.created_by_user_id = ?
      `,
      args: [userId],
    }),
  ])

  return {
    totalProperties: Number(properties.rows[0]?.total ?? 0),
    approvedProperties: Number(properties.rows[0]?.approved ?? 0),
    pendingProperties: Number(properties.rows[0]?.pending ?? 0),
    totalHotels: Number(hotels.rows[0]?.total ?? 0),
    approvedHotels: Number(hotels.rows[0]?.approved ?? 0),
    hotelBookings: Number(bookings.rows[0]?.total ?? 0),
  }
}

export async function getAdminDashboardStats() {
  await initializeDatabase()
  const db = getDbClient()
  const [users, properties, hotels, bookings] = await Promise.all([
    db.execute(`SELECT COUNT(*) AS total FROM users`),
    db.execute(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN approval_status = 'pending_review' THEN 1 ELSE 0 END) AS pending
      FROM properties
    `),
    db.execute(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN approval_status = 'pending_review' THEN 1 ELSE 0 END) AS pending
      FROM hotels
    `),
    db.execute(`SELECT COUNT(*) AS total FROM hotel_bookings`),
  ])

  return {
    totalUsers: Number(users.rows[0]?.total ?? 0),
    totalProperties: Number(properties.rows[0]?.total ?? 0),
    pendingProperties: Number(properties.rows[0]?.pending ?? 0),
    totalHotels: Number(hotels.rows[0]?.total ?? 0),
    pendingHotels: Number(hotels.rows[0]?.pending ?? 0),
    totalBookings: Number(bookings.rows[0]?.total ?? 0),
  }
}
