import type { ResultSet } from '@libsql/client'

import type {
  PropertyApprovalStatus,
  PropertyListFilters,
  PropertyRecord,
  PropertyScope,
  PropertyUpsertInput,
} from '@/lib/properties/types'
import { getDbClient } from '@/lib/server/db/client'
import { initializeDatabase } from '@/lib/server/db/init'

function parseStringArray(value: unknown) {
  if (!value) {
    return [] as string[]
  }

  try {
    const parsed = JSON.parse(String(value))
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : []
  } catch (_error) {
    return []
  }
}

function mapPropertyRow(row: ResultSet['rows'][number]): PropertyRecord {
  return {
    id: String(row.id),
    title: String(row.title),
    location: String(row.location),
    fullAddress: String(row.full_address),
    estate: row.estate ? String(row.estate) : null,
    latitude: row.latitude === null ? null : Number(row.latitude),
    longitude: row.longitude === null ? null : Number(row.longitude),
    priceValue: Number(row.price_value),
    currency: row.currency as PropertyRecord['currency'],
    pricingPeriod: row.pricing_period as PropertyRecord['pricingPeriod'],
    type: row.type as PropertyRecord['type'],
    listedBy: row.listed_by as PropertyRecord['listedBy'],
    bedrooms: Number(row.bedrooms),
    bathrooms: Number(row.bathrooms),
    sqft: Number(row.sqft),
    yearBuilt: row.year_built === null ? null : Number(row.year_built),
    features: parseStringArray(row.features_json),
    imageUrls: parseStringArray(row.image_urls_json),
    videoUrl: row.video_url ? String(row.video_url) : null,
    referenceCode: String(row.reference_code),
    documentInfo: row.document_info ? String(row.document_info) : null,
    contactName: String(row.contact_name),
    contactPhone: String(row.contact_phone),
    contactEmail: String(row.contact_email),
    verificationStatus: row.verification_status as PropertyRecord['verificationStatus'],
    approvalStatus: row.approval_status as PropertyRecord['approvalStatus'],
    status: row.status as PropertyRecord['status'],
    disclaimerAccepted: Number(row.disclaimer_accepted) === 1,
    description: String(row.description),
    featured: Number(row.featured) === 1,
    createdByUserId: String(row.created_by_user_id),
    createdByName: row.created_by_name ? String(row.created_by_name) : null,
    createdByEmail: row.created_by_email ? String(row.created_by_email) : null,
    createdByRole: row.created_by_role ? (String(row.created_by_role) as PropertyRecord['createdByRole']) : null,
    approvedByUserId: row.approved_by_user_id ? String(row.approved_by_user_id) : null,
    approvedAt: row.approved_at ? String(row.approved_at) : null,
    rejectionReason: row.rejection_reason ? String(row.rejection_reason) : null,
    viewsCount: Number(row.views_count ?? 0),
    isSaved: Number(row.is_saved ?? 0) === 1,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function buildListQuery(scope: PropertyScope, filters: PropertyListFilters) {
  const conditions: string[] = []
  const args: Array<string | number> = []

  if (scope === 'public') {
    conditions.push(`p.approval_status = 'approved'`)
    conditions.push(`p.status = 'active'`)
  }

  if (filters.search) {
    conditions.push(`(
      LOWER(p.title) LIKE ?
      OR LOWER(p.location) LIKE ?
      OR LOWER(COALESCE(p.estate, '')) LIKE ?
      OR LOWER(COALESCE(p.reference_code, '')) LIKE ?
    )`)
    const search = `%${filters.search.toLowerCase()}%`
    args.push(search, search, search, search)
  }

  if (filters.type && filters.type !== 'all') {
    conditions.push(`p.type = ?`)
    args.push(filters.type)
  }

  if (filters.status && filters.status !== 'all') {
    conditions.push(`p.status = ?`)
    args.push(filters.status)
  }

  if (filters.approvalStatus && filters.approvalStatus !== 'all') {
    conditions.push(`p.approval_status = ?`)
    args.push(filters.approvalStatus)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const limitClause = filters.limit ? `LIMIT ${Math.max(1, Math.min(filters.limit, 100))}` : ''

  return { whereClause, args, limitClause }
}

function baseSelectSql(currentUserId?: string | null) {
  const savedJoin = currentUserId
    ? `
      LEFT JOIN saved_properties sp
        ON sp.property_id = p.id
       AND sp.user_id = '${currentUserId.replace(/'/g, "''")}'
    `
    : ''

  return `
    SELECT
      p.id,
      p.title,
      p.location,
      p.full_address,
      p.estate,
      p.latitude,
      p.longitude,
      p.price_value,
      p.currency,
      p.pricing_period,
      p.type,
      p.listed_by,
      p.bedrooms,
      p.bathrooms,
      p.sqft,
      p.year_built,
      p.features_json,
      p.image_urls_json,
      p.video_url,
      p.reference_code,
      p.document_info,
      p.contact_name,
      p.contact_phone,
      p.contact_email,
      p.verification_status,
      p.approval_status,
      p.status,
      p.disclaimer_accepted,
      p.description,
      p.featured,
      p.created_by_user_id,
      u.name AS created_by_name,
      u.email AS created_by_email,
      u.role AS created_by_role,
      p.approved_by_user_id,
      p.approved_at,
      p.rejection_reason,
      COUNT(DISTINCT pv.id) AS views_count,
      ${currentUserId ? `CASE WHEN sp.id IS NULL THEN 0 ELSE 1 END` : '0'} AS is_saved,
      p.created_at,
      p.updated_at
    FROM properties p
    LEFT JOIN users u ON u.id = p.created_by_user_id
    LEFT JOIN property_views pv ON pv.property_id = p.id
    ${savedJoin}
  `
}

export async function listProperties(scope: PropertyScope, filters: PropertyListFilters = {}, userId?: string) {
  await initializeDatabase()

  const db = getDbClient()
  const query = buildListQuery(scope, filters)
  const conditions: string[] = []
  const args = [...query.args]

  if (query.whereClause) {
    conditions.push(query.whereClause.replace(/^WHERE /, ''))
  }

  if (scope === 'mine') {
    conditions.push(`p.created_by_user_id = ?`)
    args.push(userId ?? '')
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await db.execute({
    sql: `
      ${baseSelectSql(userId ?? null)}
      ${whereClause}
      GROUP BY p.id
      ORDER BY
        CASE WHEN p.approval_status = 'pending_review' THEN 0 ELSE 1 END,
        p.featured DESC,
        p.created_at DESC
      ${query.limitClause}
    `,
    args,
  })

  return result.rows.map(mapPropertyRow)
}

export async function findPropertyById(id: string) {
  await initializeDatabase()

  const db = getDbClient()
  const result = await db.execute({
    sql: `
      ${baseSelectSql()}
      WHERE p.id = ?
      GROUP BY p.id
      LIMIT 1
    `,
    args: [id],
  })

  const row = result.rows[0]
  return row ? mapPropertyRow(row) : null
}

export async function findPropertyByIdForViewer(id: string, userId?: string | null) {
  await initializeDatabase()

  const db = getDbClient()
  const result = await db.execute({
    sql: `
      ${baseSelectSql(userId ?? null)}
      WHERE p.id = ?
      GROUP BY p.id
      LIMIT 1
    `,
    args: [id],
  })

  const row = result.rows[0]
  return row ? mapPropertyRow(row) : null
}

export async function recordPropertyView(input: { id: string; propertyId: string; viewerUserId?: string | null; viewerSessionKey?: string | null }) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `
      INSERT INTO property_views (id, property_id, viewer_user_id, viewer_session_key, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `,
    args: [input.id, input.propertyId, input.viewerUserId ?? null, input.viewerSessionKey ?? null],
  })
}

export async function savePropertyForUser(input: { id: string; userId: string; propertyId: string }) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `
      INSERT OR IGNORE INTO saved_properties (id, user_id, property_id, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `,
    args: [input.id, input.userId, input.propertyId],
  })
}

export async function removeSavedPropertyForUser(userId: string, propertyId: string) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `DELETE FROM saved_properties WHERE user_id = ? AND property_id = ?`,
    args: [userId, propertyId],
  })
}

export async function listSavedPropertiesForUser(userId: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      ${baseSelectSql(userId)}
      INNER JOIN saved_properties s ON s.property_id = p.id
      WHERE s.user_id = ?
      GROUP BY p.id
      ORDER BY s.created_at DESC
    `,
    args: [userId],
  })
  return result.rows.map(mapPropertyRow)
}

export async function createProperty(input: PropertyRecord) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `
      INSERT INTO properties (
        id,
        title,
        location,
        full_address,
        estate,
        latitude,
        longitude,
        price_value,
        currency,
        pricing_period,
        type,
        listed_by,
        bedrooms,
        bathrooms,
        sqft,
        year_built,
        features_json,
        image_urls_json,
        video_url,
        reference_code,
        document_info,
        contact_name,
        contact_phone,
        contact_email,
        verification_status,
        approval_status,
        status,
        disclaimer_accepted,
        description,
        featured,
        created_by_user_id,
        approved_by_user_id,
        approved_at,
        rejection_reason,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [
      input.id,
      input.title,
      input.location,
      input.fullAddress,
      input.estate,
      input.latitude,
      input.longitude,
      input.priceValue,
      input.currency,
      input.pricingPeriod,
      input.type,
      input.listedBy,
      input.bedrooms,
      input.bathrooms,
      input.sqft,
      input.yearBuilt,
      JSON.stringify(input.features),
      JSON.stringify(input.imageUrls),
      input.videoUrl,
      input.referenceCode,
      input.documentInfo,
      input.contactName,
      input.contactPhone,
      input.contactEmail,
      input.verificationStatus,
      input.approvalStatus,
      input.status,
      input.disclaimerAccepted ? 1 : 0,
      input.description,
      input.featured ? 1 : 0,
      input.createdByUserId,
      input.approvedByUserId,
      input.approvedAt,
      input.rejectionReason,
    ],
  })

  return findPropertyById(input.id)
}

export async function updateProperty(
  id: string,
  input: PropertyUpsertInput & {
    approvalStatus: PropertyApprovalStatus
    approvedByUserId?: string | null
    approvedAt?: string | null
    rejectionReason?: string | null
  }
) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE properties
      SET
        title = ?,
        location = ?,
        full_address = ?,
        estate = ?,
        latitude = ?,
        longitude = ?,
        price_value = ?,
        currency = ?,
        pricing_period = ?,
        type = ?,
        listed_by = ?,
        bedrooms = ?,
        bathrooms = ?,
        sqft = ?,
        year_built = ?,
        features_json = ?,
        image_urls_json = ?,
        video_url = ?,
        reference_code = ?,
        document_info = ?,
        contact_name = ?,
        contact_phone = ?,
        contact_email = ?,
        verification_status = ?,
        approval_status = ?,
        status = ?,
        disclaimer_accepted = ?,
        description = ?,
        featured = ?,
        approved_by_user_id = ?,
        approved_at = ?,
        rejection_reason = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      input.title,
      input.location,
      input.fullAddress,
      input.estate ?? null,
      input.latitude ?? null,
      input.longitude ?? null,
      input.priceValue,
      input.currency,
      input.pricingPeriod,
      input.type,
      input.listedBy,
      input.bedrooms,
      input.bathrooms,
      input.sqft,
      input.yearBuilt ?? null,
      JSON.stringify(input.features),
      JSON.stringify(input.imageUrls),
      input.videoUrl ?? null,
      input.referenceCode ?? null,
      input.documentInfo ?? null,
      input.contactName,
      input.contactPhone,
      input.contactEmail,
      input.verificationStatus ?? 'not_requested',
      input.approvalStatus,
      input.status,
      input.disclaimerAccepted ? 1 : 0,
      input.description,
      input.featured ? 1 : 0,
      input.approvedByUserId ?? null,
      input.approvedAt ?? null,
      input.rejectionReason ?? null,
      id,
    ],
  })

  return findPropertyById(id)
}

export async function updatePropertyApproval(
  id: string,
  input: {
    approvalStatus: PropertyApprovalStatus
    approvedByUserId?: string | null
    approvedAt?: string | null
    rejectionReason?: string | null
  }
) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE properties
      SET
        approval_status = ?,
        approved_by_user_id = ?,
        approved_at = ?,
        rejection_reason = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      input.approvalStatus,
      input.approvedByUserId ?? null,
      input.approvedAt ?? null,
      input.rejectionReason ?? null,
      id,
    ],
  })

  return findPropertyById(id)
}

export async function deleteProperty(id: string) {
  await initializeDatabase()

  const db = getDbClient()
  await db.execute({
    sql: `DELETE FROM properties WHERE id = ?`,
    args: [id],
  })
}

export async function countProperties() {
  await initializeDatabase()

  const db = getDbClient()
  const result = await db.execute(`SELECT COUNT(*) AS count FROM properties`)
  return Number(result.rows[0]?.count ?? 0)
}
