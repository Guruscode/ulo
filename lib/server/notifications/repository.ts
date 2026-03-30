import { randomUUID } from 'crypto'

import { initializeDatabase } from '@/lib/server/db/init'
import { getDbClient } from '@/lib/server/db/client'

import type { UserNotificationRecord } from './types'

function mapRow(row: Record<string, unknown>): UserNotificationRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    title: String(row.title),
    message: String(row.message),
    href: row.href ? String(row.href) : null,
    createdAt: String(row.created_at),
  }
}

export async function createUserNotificationRecord(input: {
  userId: string
  title: string
  message: string
  href?: string | null
}) {
  await initializeDatabase()
  const db = getDbClient()
  const id = randomUUID()

  await db.execute({
    sql: `
      INSERT INTO user_notifications (id, user_id, title, message, href, created_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
    args: [id, input.userId, input.title, input.message, input.href ?? null],
  })
}

export async function listUserNotificationRecords(userId: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT id, user_id, title, message, href, created_at
      FROM user_notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `,
    args: [userId],
  })

  return result.rows.map((row) => mapRow(row as Record<string, unknown>))
}

export async function getUserNotificationRecord(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT id, user_id, title, message, href, created_at
      FROM user_notifications
      WHERE id = ?
      LIMIT 1
    `,
    args: [id],
  })
  const row = result.rows[0]
  return row ? mapRow(row as Record<string, unknown>) : null
}

export async function deleteUserNotificationRecord(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({ sql: `DELETE FROM user_notifications WHERE id = ?`, args: [id] })
}
