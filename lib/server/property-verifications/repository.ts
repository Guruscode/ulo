import { randomUUID } from 'crypto'
import type { ResultSet } from '@libsql/client'

import type { PropertyVerificationRequestRecord } from '@/lib/property-verification/types'
import { getDbClient } from '@/lib/server/db/client'
import { initializeDatabase } from '@/lib/server/db/init'

function parseStringArray(value: unknown) {
  if (!value) return [] as string[]
  try {
    const parsed = JSON.parse(String(value))
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function mapVerificationRequest(row: ResultSet['rows'][number]): PropertyVerificationRequestRecord {
  return {
    id: String(row.id),
    trackingCode: String(row.tracking_code),
    propertyId: row.property_id ? String(row.property_id) : null,
    propertyTitle: String(row.property_title),
    propertyLocation: String(row.property_location),
    propertyAddress: String(row.property_address),
    requesterUserId: row.requester_user_id ? String(row.requester_user_id) : null,
    requesterName: String(row.requester_name),
    requesterEmail: String(row.requester_email),
    requesterPhone: String(row.requester_phone),
    state: String(row.state),
    area: String(row.area),
    goal: row.goal ? String(row.goal) : null,
    packageId: row.package_id as PropertyVerificationRequestRecord['packageId'],
    packageName: String(row.package_name),
    amount: Number(row.amount),
    paymentReference: String(row.payment_reference),
    paymentStatus: row.payment_status as PropertyVerificationRequestRecord['paymentStatus'],
    verificationStatus: row.verification_status as PropertyVerificationRequestRecord['verificationStatus'],
    titleDocumentType: row.title_document_type ? String(row.title_document_type) : null,
    titleDocumentUrls: parseStringArray(row.title_document_urls_json),
    surveyPlanUrls: parseStringArray(row.survey_plan_urls_json),
    additionalDocumentUrls: parseStringArray(row.additional_document_urls_json),
    paystackAccessCode: row.paystack_access_code ? String(row.paystack_access_code) : null,
    paystackAuthorizationUrl: row.paystack_authorization_url ? String(row.paystack_authorization_url) : null,
    paidAt: row.paid_at ? String(row.paid_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

export async function createPropertyVerificationRequest(input: Omit<PropertyVerificationRequestRecord, 'id' | 'createdAt' | 'updatedAt' | 'paidAt'> & { paidAt?: string | null }) {
  await initializeDatabase()
  const db = getDbClient()
  const id = randomUUID()

  await db.execute({
    sql: `
      INSERT INTO property_verification_requests (
        id, tracking_code, property_id, property_title, property_location, property_address,
        requester_user_id, requester_name, requester_email, requester_phone, state, area, goal,
        package_id, package_name, amount, payment_reference, payment_status, verification_status,
        title_document_type, title_document_urls_json, survey_plan_urls_json, additional_document_urls_json,
        paystack_access_code, paystack_authorization_url, paid_at, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [
      id,
      input.trackingCode,
      input.propertyId,
      input.propertyTitle,
      input.propertyLocation,
      input.propertyAddress,
      input.requesterUserId,
      input.requesterName,
      input.requesterEmail,
      input.requesterPhone,
      input.state,
      input.area,
      input.goal ?? null,
      input.packageId,
      input.packageName,
      input.amount,
      input.paymentReference,
      input.paymentStatus,
      input.verificationStatus,
      input.titleDocumentType ?? null,
      JSON.stringify(input.titleDocumentUrls),
      JSON.stringify(input.surveyPlanUrls),
      JSON.stringify(input.additionalDocumentUrls),
      input.paystackAccessCode ?? null,
      input.paystackAuthorizationUrl ?? null,
      input.paidAt ?? null,
    ],
  })

  return findPropertyVerificationRequestById(id)
}

export async function findPropertyVerificationRequestById(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `SELECT * FROM property_verification_requests WHERE id = ? LIMIT 1`,
    args: [id],
  })
  return result.rows[0] ? mapVerificationRequest(result.rows[0]) : null
}

export async function findPropertyVerificationRequestByReference(reference: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `SELECT * FROM property_verification_requests WHERE payment_reference = ? LIMIT 1`,
    args: [reference],
  })
  return result.rows[0] ? mapVerificationRequest(result.rows[0]) : null
}

export async function findPropertyVerificationRequestByTrackingCode(trackingCode: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `SELECT * FROM property_verification_requests WHERE tracking_code = ? LIMIT 1`,
    args: [trackingCode],
  })
  return result.rows[0] ? mapVerificationRequest(result.rows[0]) : null
}

export async function listPropertyVerificationRequestsByEmail(email: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT *
      FROM property_verification_requests
      WHERE LOWER(requester_email) = LOWER(?)
      ORDER BY created_at DESC
    `,
    args: [email],
  })
  return result.rows.map(mapVerificationRequest)
}

export async function updatePropertyVerificationRequest(
  id: string,
  input: Partial<Pick<PropertyVerificationRequestRecord, 'paymentStatus' | 'verificationStatus' | 'paystackAccessCode' | 'paystackAuthorizationUrl' | 'paidAt'>>
) {
  await initializeDatabase()
  const current = await findPropertyVerificationRequestById(id)
  if (!current) return null
  const next = { ...current, ...input }
  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE property_verification_requests
      SET
        payment_status = ?,
        verification_status = ?,
        paystack_access_code = ?,
        paystack_authorization_url = ?,
        paid_at = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      next.paymentStatus,
      next.verificationStatus,
      next.paystackAccessCode ?? null,
      next.paystackAuthorizationUrl ?? null,
      next.paidAt ?? null,
      id,
    ],
  })
  return findPropertyVerificationRequestById(id)
}
