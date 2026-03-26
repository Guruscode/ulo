import type { ResultSet } from '@libsql/client'

import type { AccountStatus, AccountType, ApprovalStatus, AuthUser, IdentityType, UserRole } from '@/lib/auth/types'
import { getDbClient } from '@/lib/server/db/client'
import { initializeDatabase } from '@/lib/server/db/init'

export interface UserRecord extends AuthUser {
  passwordHash: string
  isActive: boolean
  lastLoginAt?: string | null
}

function mapUserRow(row: ResultSet['rows'][number]): UserRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    profileImageUrl: row.profile_image_url ? String(row.profile_image_url) : null,
    role: row.role as UserRole,
    accountType: row.account_type as AccountType,
    status: Number(row.is_active) === 1 ? 'active' : 'disabled',
    approvalStatus: row.approval_status as ApprovalStatus,
    phone: row.phone ? String(row.phone) : null,
    address: row.address ? String(row.address) : null,
    state: row.state ? String(row.state) : null,
    localGovernment: row.local_government ? String(row.local_government) : null,
    identityType: row.identity_type ? (String(row.identity_type) as IdentityType) : null,
    identityNumber: row.identity_number ? String(row.identity_number) : null,
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

function mapUser(result: ResultSet): UserRecord | null {
  const row = result.rows[0]
  if (!row) {
    return null
  }
  return mapUserRow(row)
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
        profile_image_url,
        phone,
        address,
        state,
        local_government,
        account_type,
        approval_status,
        identity_type,
        identity_number,
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
        profile_image_url,
        phone,
        address,
        state,
        local_government,
        account_type,
        approval_status,
        identity_type,
        identity_number,
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
  phone?: string | null
  address?: string | null
  state?: string | null
  localGovernment?: string | null
  accountType?: AccountType
  approvalStatus?: ApprovalStatus
  identityType?: IdentityType | null
  identityNumber?: string | null
}) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `
      INSERT INTO users (
        id, name, email, phone, address, state, local_government, account_type, approval_status,
        identity_type, identity_number, password_hash, hashed_password, role, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [
      input.id,
      input.name,
      input.email.toLowerCase(),
      input.phone ?? null,
      input.address ?? null,
      input.state ?? null,
      input.localGovernment ?? null,
      input.accountType ?? 'user',
      input.approvalStatus ?? 'approved',
      input.identityType ?? null,
      input.identityNumber ?? null,
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
      INSERT INTO users (id, name, email, account_type, approval_status, password_hash, hashed_password, role, is_active, created_at, updated_at)
      VALUES (?, ?, ?, 'agent', 'approved', ?, ?, 'admin', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        account_type = 'agent',
        approval_status = 'approved',
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
    profileImageUrl?: string | null
    phone?: string | null
    address?: string | null
    state?: string | null
    localGovernment?: string | null
    identityType?: IdentityType | null
    identityNumber?: string | null
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
        profile_image_url = ?,
        phone = ?,
        address = ?,
        state = ?,
        local_government = ?,
        identity_type = ?,
        identity_number = ?,
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
      input.profileImageUrl ?? null,
      input.phone ?? null,
      input.address ?? null,
      input.state ?? null,
      input.localGovernment ?? null,
      input.identityType ?? null,
      input.identityNumber ?? null,
      input.timezone,
      input.emailNotifications ? 1 : 0,
      input.pushNotifications ? 1 : 0,
      input.twoFactorEnabled ? 1 : 0,
      id,
    ],
  })

  return findUserById(id)
}

export async function listUsers(filters?: { accountType?: string; approvalStatus?: string; search?: string }) {
  await initializeDatabase()
  const db = getDbClient()
  const conditions: string[] = []
  const args: Array<string | number> = []

  if (filters?.search) {
    const search = `%${filters.search.toLowerCase()}%`
    conditions.push(`(LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(COALESCE(phone, '')) LIKE ?)`)
    args.push(search, search, search)
  }

  if (filters?.accountType && filters.accountType !== 'all') {
    conditions.push(`account_type = ?`)
    args.push(filters.accountType)
  }

  if (filters?.approvalStatus && filters.approvalStatus !== 'all') {
    conditions.push(`approval_status = ?`)
    args.push(filters.approvalStatus)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await db.execute({
    sql: `
      SELECT
        id, name, email, phone, address, state, local_government, account_type, approval_status,
        identity_type, identity_number, role, profile_image_url, timezone, email_notifications, push_notifications,
        two_factor_enabled, COALESCE(NULLIF(password_hash, ''), hashed_password, '') AS password_hash,
        COALESCE(is_active, 1) AS is_active, COALESCE(created_at, CURRENT_TIMESTAMP) AS created_at,
        COALESCE(updated_at, created_at, CURRENT_TIMESTAMP) AS updated_at, last_login_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
    `,
    args,
  })

  return result.rows.map(mapUserRow)
}

export async function updateUserAdminFields(
  id: string,
  input: {
    name: string
    email: string
    phone?: string | null
    address?: string | null
    state?: string | null
    localGovernment?: string | null
    accountType: AccountType
    approvalStatus: ApprovalStatus
    identityType?: IdentityType | null
    identityNumber?: string | null
    isActive: boolean
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
        address = ?,
        state = ?,
        local_government = ?,
        account_type = ?,
        approval_status = ?,
        identity_type = ?,
        identity_number = ?,
        is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      input.name,
      input.email.toLowerCase(),
      input.phone ?? null,
      input.address ?? null,
      input.state ?? null,
      input.localGovernment ?? null,
      input.accountType,
      input.approvalStatus,
      input.identityType ?? null,
      input.identityNumber ?? null,
      input.isActive ? 1 : 0,
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
