import { createHash, randomUUID } from 'crypto'

import type { AccountType, IdentityType } from '@/lib/auth/types'
import { ApiError } from '@/lib/server/http/api-error'
import { getDbClient } from '@/lib/server/db/client'
import { initializeDatabase } from '@/lib/server/db/init'

export type SignupVerificationRecord = {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  state: string | null
  localGovernment: string | null
  accountType: AccountType
  identityType: IdentityType | null
  identityNumber: string | null
  passwordHash: string
  otpHash: string
  expiresAt: string
  consumedAt: string | null
  attempts: number
}

function mapRecord(row: Record<string, unknown>): SignupVerificationRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: row.phone ? String(row.phone) : null,
    address: row.address ? String(row.address) : null,
    state: row.state ? String(row.state) : null,
    localGovernment: row.local_government ? String(row.local_government) : null,
    accountType: row.account_type as AccountType,
    identityType: row.identity_type === 'bvn' ? 'bvn' : null,
    identityNumber: row.identity_number ? String(row.identity_number) : null,
    passwordHash: String(row.password_hash),
    otpHash: String(row.otp_hash),
    expiresAt: String(row.expires_at),
    consumedAt: row.consumed_at ? String(row.consumed_at) : null,
    attempts: Number(row.attempts ?? 0),
  }
}

export function hashOtp(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function createSignupVerification(input: {
  name: string
  email: string
  phone: string
  address: string
  state: string
  localGovernment: string
  accountType: AccountType
  identityType?: IdentityType | null
  identityNumber?: string | null
  passwordHash: string
  otpHash: string
  expiresAt: string
}) {
  await initializeDatabase()

  const db = getDbClient()
  const id = randomUUID()
  await db.execute({
    sql: `DELETE FROM signup_verifications WHERE email = ?`,
    args: [input.email.toLowerCase()],
  })
  await db.execute({
    sql: `
      INSERT INTO signup_verifications (
        id, name, email, phone, address, state, local_government, account_type, identity_type, identity_number,
        password_hash, otp_hash, expires_at, consumed_at, attempts, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [
      id,
      input.name,
      input.email.toLowerCase(),
      input.phone,
      input.address,
      input.state,
      input.localGovernment,
      input.accountType,
      input.identityType ?? null,
      input.identityNumber ?? null,
      input.passwordHash,
      input.otpHash,
      input.expiresAt,
    ],
  })

  return id
}

export async function findSignupVerificationById(id: string) {
  await initializeDatabase()

  const db = getDbClient()
  const result = await db.execute({
    sql: `SELECT * FROM signup_verifications WHERE id = ? LIMIT 1`,
    args: [id],
  })

  const row = result.rows[0]
  return row ? mapRecord(row as Record<string, unknown>) : null
}

export async function incrementSignupVerificationAttempts(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE signup_verifications
      SET attempts = COALESCE(attempts, 0) + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [id],
  })
}

export async function consumeSignupVerification(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE signup_verifications
      SET consumed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [id],
  })
}

export async function refreshSignupVerification(id: string, otpHash: string, expiresAt: string) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE signup_verifications
      SET otp_hash = ?, expires_at = ?, attempts = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [otpHash, expiresAt, id],
  })
}

export function assertSignupVerificationUsable(record: SignupVerificationRecord) {
  if (record.consumedAt) {
    throw new ApiError(400, 'OTP_ALREADY_USED', 'This verification code has already been used.')
  }

  if (record.attempts >= 5) {
    throw new ApiError(400, 'OTP_TOO_MANY_ATTEMPTS', 'Too many invalid attempts. Request a new code.')
  }

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    throw new ApiError(400, 'OTP_EXPIRED', 'This verification code has expired. Request a new code.')
  }
}
