import { randomUUID } from 'crypto'
import type { ResultSet } from '@libsql/client'

import type { SubscriptionPlanRecord, UserSubscriptionRecord } from '@/lib/subscriptions/types'
import { getDbClient } from '@/lib/server/db/client'
import { initializeDatabase } from '@/lib/server/db/init'

function parseFeatures(value: unknown) {
  if (!value) return [] as string[]
  try {
    const parsed = JSON.parse(String(value))
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function mapPlan(row: ResultSet['rows'][number]): SubscriptionPlanRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description),
    priceAmount: Number(row.price_amount),
    currency: 'NGN',
    billingInterval: row.billing_interval as SubscriptionPlanRecord['billingInterval'],
    propertyLimit: Number(row.property_limit),
    hotelLimit: Number(row.hotel_limit),
    features: parseFeatures(row.features_json),
    isFree: Number(row.is_free) === 1,
    isActive: Number(row.is_active) === 1,
    paystackPlanCode: row.paystack_plan_code ? String(row.paystack_plan_code) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

function mapUserSubscription(row: ResultSet['rows'][number]): UserSubscriptionRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    userName: row.user_name ? String(row.user_name) : null,
    userEmail: row.user_email ? String(row.user_email) : null,
    planId: String(row.plan_id),
    planName: String(row.plan_name),
    status: row.status as UserSubscriptionRecord['status'],
    amount: Number(row.amount),
    currency: 'NGN',
    billingInterval: row.billing_interval as UserSubscriptionRecord['billingInterval'],
    paymentProvider: row.payment_provider as UserSubscriptionRecord['paymentProvider'],
    paymentReference: row.payment_reference ? String(row.payment_reference) : null,
    paystackAccessCode: row.paystack_access_code ? String(row.paystack_access_code) : null,
    paystackAuthorizationUrl: row.paystack_authorization_url ? String(row.paystack_authorization_url) : null,
    startsAt: row.starts_at ? String(row.starts_at) : null,
    endsAt: row.ends_at ? String(row.ends_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

export async function countSubscriptionPlans() {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute(`SELECT COUNT(*) AS count FROM subscription_plans`)
  return Number(result.rows[0]?.count ?? 0)
}

export async function createSubscriptionPlan(input: Omit<SubscriptionPlanRecord, 'createdAt' | 'updatedAt'>) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `
      INSERT INTO subscription_plans (
        id, name, slug, description, price_amount, currency, billing_interval, property_limit,
        hotel_limit, features_json, is_free, is_active, paystack_plan_code, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [
      input.id,
      input.name,
      input.slug,
      input.description,
      input.priceAmount,
      input.currency,
      input.billingInterval,
      input.propertyLimit,
      input.hotelLimit,
      JSON.stringify(input.features),
      input.isFree ? 1 : 0,
      input.isActive ? 1 : 0,
      input.paystackPlanCode,
    ],
  })
}

export async function listSubscriptionPlans(activeOnly = false) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute(`
    SELECT * FROM subscription_plans
    ${activeOnly ? `WHERE is_active = 1` : ''}
    ORDER BY price_amount ASC, created_at ASC
  `)
  return result.rows.map(mapPlan)
}

export async function findSubscriptionPlanById(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({ sql: `SELECT * FROM subscription_plans WHERE id = ? LIMIT 1`, args: [id] })
  return result.rows[0] ? mapPlan(result.rows[0]) : null
}

export async function findSubscriptionPlanBySlug(slug: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({ sql: `SELECT * FROM subscription_plans WHERE slug = ? LIMIT 1`, args: [slug] })
  return result.rows[0] ? mapPlan(result.rows[0]) : null
}

export async function updateSubscriptionPlan(id: string, input: Partial<Omit<SubscriptionPlanRecord, 'id' | 'createdAt' | 'updatedAt'>>) {
  await initializeDatabase()
  const current = await findSubscriptionPlanById(id)
  if (!current) return null
  const next = { ...current, ...input }
  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE subscription_plans
      SET
        name = ?, slug = ?, description = ?, price_amount = ?, billing_interval = ?, property_limit = ?,
        hotel_limit = ?, features_json = ?, is_free = ?, is_active = ?, paystack_plan_code = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      next.name,
      next.slug,
      next.description,
      next.priceAmount,
      next.billingInterval,
      next.propertyLimit,
      next.hotelLimit,
      JSON.stringify(next.features),
      next.isFree ? 1 : 0,
      next.isActive ? 1 : 0,
      next.paystackPlanCode,
      id,
    ],
  })
  return findSubscriptionPlanById(id)
}

export async function createUserSubscription(input: {
  userId: string
  planId: string
  status: UserSubscriptionRecord['status']
  amount: number
  currency: 'NGN'
  billingInterval: UserSubscriptionRecord['billingInterval']
  paymentProvider: UserSubscriptionRecord['paymentProvider']
  paymentReference?: string | null
  paystackAccessCode?: string | null
  paystackAuthorizationUrl?: string | null
  startsAt?: string | null
  endsAt?: string | null
}) {
  await initializeDatabase()
  const db = getDbClient()
  const id = randomUUID()
  await db.execute({
    sql: `
      INSERT INTO user_subscriptions (
        id, user_id, plan_id, status, amount, currency, billing_interval, payment_provider,
        payment_reference, paystack_access_code, paystack_authorization_url, starts_at, ends_at, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
    args: [
      id,
      input.userId,
      input.planId,
      input.status,
      input.amount,
      input.currency,
      input.billingInterval,
      input.paymentProvider,
      input.paymentReference ?? null,
      input.paystackAccessCode ?? null,
      input.paystackAuthorizationUrl ?? null,
      input.startsAt ?? null,
      input.endsAt ?? null,
    ],
  })
  return findUserSubscriptionById(id)
}

export async function findUserSubscriptionByReference(reference: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT s.*, p.name AS plan_name, u.name AS user_name, u.email AS user_email
      FROM user_subscriptions s
      INNER JOIN subscription_plans p ON p.id = s.plan_id
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.payment_reference = ?
      LIMIT 1
    `,
    args: [reference],
  })
  return result.rows[0] ? mapUserSubscription(result.rows[0]) : null
}

export async function findUserSubscriptionById(id: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT s.*, p.name AS plan_name, u.name AS user_name, u.email AS user_email
      FROM user_subscriptions s
      INNER JOIN subscription_plans p ON p.id = s.plan_id
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
      LIMIT 1
    `,
    args: [id],
  })
  return result.rows[0] ? mapUserSubscription(result.rows[0]) : null
}

export async function listUserSubscriptions(scope: 'admin' | 'mine', userId?: string) {
  await initializeDatabase()
  const db = getDbClient()
  const whereClause = scope === 'mine' ? 'WHERE s.user_id = ?' : ''
  const result = await db.execute({
    sql: `
      SELECT s.*, p.name AS plan_name, u.name AS user_name, u.email AS user_email
      FROM user_subscriptions s
      INNER JOIN subscription_plans p ON p.id = s.plan_id
      LEFT JOIN users u ON u.id = s.user_id
      ${whereClause}
      ORDER BY s.created_at DESC
    `,
    args: scope === 'mine' ? [userId ?? ''] : [],
  })
  return result.rows.map(mapUserSubscription)
}

export async function findCurrentUserSubscription(userId: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `
      SELECT s.*, p.name AS plan_name, u.name AS user_name, u.email AS user_email
      FROM user_subscriptions s
      INNER JOIN subscription_plans p ON p.id = s.plan_id
      LEFT JOIN users u ON u.id = s.user_id
      WHERE s.user_id = ? AND s.status = 'active'
      ORDER BY COALESCE(s.ends_at, s.created_at) DESC
      LIMIT 1
    `,
    args: [userId],
  })
  return result.rows[0] ? mapUserSubscription(result.rows[0]) : null
}

export async function expireActiveUserSubscriptions(userId: string) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE user_subscriptions
      SET status = 'expired', updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND status = 'active'
    `,
    args: [userId],
  })
}

export async function updateUserSubscription(id: string, input: Partial<Pick<UserSubscriptionRecord, 'status' | 'startsAt' | 'endsAt'>>) {
  await initializeDatabase()
  const current = await findUserSubscriptionById(id)
  if (!current) return null
  const next = { ...current, ...input }
  const db = getDbClient()
  await db.execute({
    sql: `
      UPDATE user_subscriptions
      SET status = ?, starts_at = ?, ends_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [next.status, next.startsAt, next.endsAt, id],
  })
  return findUserSubscriptionById(id)
}
