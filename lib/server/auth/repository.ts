import type { ResultSet } from '@libsql/client'

import type { AuthUser, UserRole } from '@/lib/auth/types'
import { getDbClient } from '@/lib/server/db/client'
import { initializeDatabase } from '@/lib/server/db/init'

export interface UserRecord extends AuthUser {
  passwordHash: string
  isActive: boolean
  lastLoginAt?: string | null
}

function mapUser(result: ResultSet): UserRecord | null {
  const row = result.rows[0]

  if (!row) {
    return null
  }

  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    role: row.role as UserRole,
    phone: row.phone ? String(row.phone) : null,
    timezone: row.timezone ? String(row.timezone) : null,
    emailNotifications: Number(row.email_notifications) === 1,
    pushNotifications: Number(row.push_notifications) === 1,
    twoFactorEnabled: Number(row.two_factor_enabled) === 1,
    passwordHash: String(row.password_hash),
    isActive: Number(row.is_active) === 1,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    lastLoginAt: row.last_login_at ? String(row.last_login_at) : null,
  }
}

export async function findUserByEmail(email: string) {
  await initializeDatabase()

  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT
        id,
        name,
        email,
        phone,
        role,
        timezone,
        email_notifications,
        push_notifications,
        two_factor_enabled,
        COALESCE(NULLIF(password_hash, ''), hashed_password, '') AS password_hash,
        COALESCE(is_active, 1) AS is_active,
        COALESCE(created_at, CURRENT_TIMESTAMP) AS created_at,
        COALESCE(updated_at, created_at, CURRENT_TIMESTAMP) AS updated_at,
        last_login_at
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    args: [email.toLowerCase()],
  })

  return mapUser(result)
}

export async function findUserById(id: string) {
  await initializeDatabase()

  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT
        id,
        name,
        email,
        phone,
        role,
        timezone,
        email_notifications,
        push_notifications,
        two_factor_enabled,
        COALESCE(NULLIF(password_hash, ''), hashed_password, '') AS password_hash,
        COALESCE(is_active, 1) AS is_active,
        COALESCE(created_at, CURRENT_TIMESTAMP) AS created_at,
        COALESCE(updated_at, created_at, CURRENT_TIMESTAMP) AS updated_at,
        last_login_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    args: [id],
  })

  return mapUser(result)
}

export async function createUser(input: {
  id: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
}) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `
      INSERT INTO users (id, name, email, password_hash, hashed_password, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [
      input.id,
      input.name,
      input.email.toLowerCase(),
      input.passwordHash,
      input.passwordHash,
      input.role,
    ],
  })

  return findUserById(input.id)
}

export async function upsertAdminUser(input: {
  id: string
  name: string
  email: string
  passwordHash: string
}) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `
      INSERT INTO users (id, name, email, password_hash, hashed_password, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'admin', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        password_hash = excluded.password_hash,
        hashed_password = excluded.hashed_password,
        role = 'admin',
        is_active = 1,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [input.id, input.name, input.email.toLowerCase(), input.passwordHash, input.passwordHash],
  })

  return findUserByEmail(input.email)
}

export async function updateLastLogin(id: string) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE users
      SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [id],
  })
}

export async function updateUserProfile(
  id: string,
  input: {
    name: string
    email: string
    phone?: string | null
    timezone: string
    emailNotifications: boolean
    pushNotifications: boolean
    twoFactorEnabled: boolean
  }
) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE users
      SET
        name = ?,
        email = ?,
        phone = ?,
        timezone = ?,
        email_notifications = ?,
        push_notifications = ?,
        two_factor_enabled = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      input.name,
      input.email.toLowerCase(),
      input.phone ?? null,
      input.timezone,
      input.emailNotifications ? 1 : 0,
      input.pushNotifications ? 1 : 0,
      input.twoFactorEnabled ? 1 : 0,
      id,
    ],
  })

  return findUserById(id)
}

export async function updateUserPassword(id: string, passwordHash: string) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE users
      SET
        password_hash = ?,
        hashed_password = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [passwordHash, passwordHash, id],
  })
}
