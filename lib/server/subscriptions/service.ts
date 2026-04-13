import { randomUUID } from 'crypto'
import { z } from 'zod'

import type { AuthUser } from '@/lib/auth/types'
import type { SubscriptionPaymentMethod, SubscriptionPlanRecord } from '@/lib/subscriptions/types'
import { ApiError } from '@/lib/server/http/api-error'
import { getServerEnv } from '@/lib/server/config/env'
import { getDbClient } from '@/lib/server/db/client'
import { initializeDatabase } from '@/lib/server/db/init'
import { initializePaystackTransaction, verifyPaystackTransaction } from '@/lib/server/paystack/client'
import {
  countSubscriptionPlans,
  createSubscriptionPlan,
  createUserSubscription,
  countSubscriptionsForPlan,
  deleteSubscriptionPlan,
  expireActiveUserSubscriptions,
  findCurrentUserSubscription,
  findSubscriptionPlanById,
  findSubscriptionPlanBySlug,
  findUserSubscriptionById,
  findUserSubscriptionByReference,
  listSubscriptionPlans,
  listUserSubscriptions,
  updateSubscriptionPlan,
  updateUserSubscription,
  deleteUserSubscription,
} from '@/lib/server/subscriptions/repository'

function requireAdmin(actor: AuthUser) {
  if (actor.role !== 'admin') {
    throw new ApiError(403, 'FORBIDDEN', 'Admin access is required.')
  }
}

const SUBSCRIPTION_PAYMENT_METHOD_KEY = 'subscription_payment_method'
const SUBSCRIPTION_BANK_NAME_KEY = 'subscription_bank_name'
const SUBSCRIPTION_ACCOUNT_NAME_KEY = 'subscription_account_name'
const SUBSCRIPTION_ACCOUNT_NUMBER_KEY = 'subscription_account_number'

function subscriptionPlanSchema() {
  return z.object({
    name: z.string().trim().min(2),
    slug: z.string().trim().min(2),
    description: z.string().trim().min(5),
    priceAmount: z.number().int().min(0),
    billingInterval: z.enum(['month', 'year']),
    propertyLimit: z.number().int().min(-1),
    hotelLimit: z.number().int().min(-1),
    features: z.array(z.string().trim().min(1)).min(1),
    isFree: z.boolean(),
    isActive: z.boolean(),
    paystackPlanCode: z.string().trim().optional().nullable(),
  })
}

export async function listPlansForActor(actor?: AuthUser | null) {
  const plans = await listSubscriptionPlans(!actor || actor.role !== 'admin')
  return plans
}

export async function savePlanForAdmin(actor: AuthUser, input: unknown, id?: string) {
  requireAdmin(actor)
  const parsed = subscriptionPlanSchema().safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please correct the subscription plan fields.', parsed.error.flatten())
  }

  if (id) {
    const updated = await updateSubscriptionPlan(id, parsed.data)
    if (!updated) throw new ApiError(404, 'PLAN_NOT_FOUND', 'Subscription plan not found.')
    return updated
  }

  await createSubscriptionPlan({
    id: randomUUID(),
    currency: 'NGN',
    ...parsed.data,
    paystackPlanCode: parsed.data.paystackPlanCode ?? null,
  })
  const created = await findSubscriptionPlanBySlug(parsed.data.slug)
  if (!created) throw new ApiError(500, 'PLAN_CREATE_FAILED', 'Unable to create subscription plan.')
  return created
}

export async function listSubscriptionsForActor(actor: AuthUser) {
  return actor.role === 'admin' ? listUserSubscriptions('admin') : listUserSubscriptions('mine', actor.id)
}

export async function getEffectiveSubscriptionForUser(userId: string) {
  const active = await findCurrentUserSubscription(userId)
  if (active) {
    if (active.endsAt && new Date(active.endsAt).getTime() <= Date.now()) {
      await updateUserSubscription(active.id, {
        status: 'expired',
      })
    } else {
      const plan = await findSubscriptionPlanById(active.planId)
      if (plan) return { plan, subscription: active }
    }
  }

  const freePlan = await findSubscriptionPlanBySlug('free')
  if (!freePlan) {
    throw new ApiError(500, 'FREE_PLAN_MISSING', 'Free subscription plan is not configured.')
  }

  return { plan: freePlan, subscription: null }
}

export async function deletePlanForAdmin(actor: AuthUser, id: string) {
  requireAdmin(actor)
  const plan = await findSubscriptionPlanById(id)
  if (!plan) {
    throw new ApiError(404, 'PLAN_NOT_FOUND', 'Subscription plan not found.')
  }
  if (plan.isFree) {
    throw new ApiError(400, 'PLAN_DELETE_FORBIDDEN', 'The free plan cannot be deleted.')
  }
  const subscriptionsCount = await countSubscriptionsForPlan(id)
  if (subscriptionsCount > 0) {
    throw new ApiError(400, 'PLAN_DELETE_BLOCKED', 'Cannot delete a plan while users are subscribed to it.')
  }
  await deleteSubscriptionPlan(id)
  return plan
}

export async function getSubscriptionPaymentMethod(): Promise<SubscriptionPaymentMethod> {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `SELECT value FROM app_settings WHERE key = ? LIMIT 1`,
    args: [SUBSCRIPTION_PAYMENT_METHOD_KEY],
  })

  return result.rows[0]?.value === 'account' ? 'account' : 'paystack'
}

async function getAppSetting(key: string) {
  await initializeDatabase()
  const db = getDbClient()
  const result = await db.execute({
    sql: `SELECT value FROM app_settings WHERE key = ? LIMIT 1`,
    args: [key],
  })
  return result.rows[0]?.value ? String(result.rows[0].value) : null
}

async function setAppSetting(key: string, value: string) {
  await initializeDatabase()
  const db = getDbClient()
  await db.execute({
    sql: `
      INSERT INTO app_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [key, value],
  })
}

export async function setSubscriptionPaymentMethodForAdmin(actor: AuthUser, method: SubscriptionPaymentMethod) {
  requireAdmin(actor)
  await setAppSetting(SUBSCRIPTION_PAYMENT_METHOD_KEY, method)

  return { method }
}

export async function getSubscriptionSettings() {
  const env = getServerEnv()
  const [method, bankName, accountName, accountNumber] = await Promise.all([
    getSubscriptionPaymentMethod(),
    getAppSetting(SUBSCRIPTION_BANK_NAME_KEY),
    getAppSetting(SUBSCRIPTION_ACCOUNT_NAME_KEY),
    getAppSetting(SUBSCRIPTION_ACCOUNT_NUMBER_KEY),
  ])

  return {
    method,
    bankName: bankName || env.subscriptionBankName || 'Access Bank',
    accountName: accountName || env.subscriptionAccountName || 'ULO TECHNOLOGIES',
    accountNumber: accountNumber || env.subscriptionAccountNumber || '0012345678',
  }
}

export async function updateSubscriptionSettingsForAdmin(
  actor: AuthUser,
  input: {
    method: SubscriptionPaymentMethod
    bankName: string
    accountName: string
    accountNumber: string
  }
) {
  requireAdmin(actor)

  await Promise.all([
    setAppSetting(SUBSCRIPTION_PAYMENT_METHOD_KEY, input.method),
    setAppSetting(SUBSCRIPTION_BANK_NAME_KEY, input.bankName),
    setAppSetting(SUBSCRIPTION_ACCOUNT_NAME_KEY, input.accountName),
    setAppSetting(SUBSCRIPTION_ACCOUNT_NUMBER_KEY, input.accountNumber),
  ])

  return getSubscriptionSettings()
}

function getAdminListingLimit(actor: AuthUser, type: 'property' | 'hotel') {
  return type === 'property' ? actor.propertyListingLimit : actor.hotelListingLimit
}

function buildWhatsappUrl(message: string) {
  const env = getServerEnv()
  const rawNumber = env.subscriptionWhatsappNumber?.replace(/\D/g, '') || ''
  const encodedMessage = encodeURIComponent(message)

  return rawNumber
    ? `https://wa.me/${rawNumber}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`
}

export async function initializeSubscriptionCheckout(actor: AuthUser, planId: string) {
  const plan = await findSubscriptionPlanById(planId)
  if (!plan || !plan.isActive) {
    throw new ApiError(404, 'PLAN_NOT_FOUND', 'Subscription plan not found.')
  }

  if (plan.isFree) {
    throw new ApiError(400, 'FREE_PLAN_NO_CHECKOUT', 'The free plan does not require checkout.')
  }

  const paymentMethod = await getSubscriptionPaymentMethod()

  if (paymentMethod === 'account') {
    const reference = `ULO-MANUAL-SUB-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const pending = await createUserSubscription({
      userId: actor.id,
      planId: plan.id,
      status: 'pending',
      amount: plan.priceAmount,
      currency: 'NGN',
      billingInterval: plan.billingInterval,
      paymentProvider: 'manual',
      paymentReference: reference,
    })

    if (!pending) {
      throw new ApiError(500, 'SUBSCRIPTION_INIT_FAILED', 'Unable to create pending manual subscription.')
    }

    const whatsappMessage = [
      'Hello, I have made a subscription payment and I want to send my receipt.',
      `Name: ${actor.name}`,
      `Email: ${actor.email}`,
      `Plan: ${plan.name}`,
      `Amount: NGN ${plan.priceAmount.toLocaleString()}`,
      `Reference: ${reference}`,
    ].join('\n')

    return {
      paymentProvider: 'manual' as const,
      reference,
      whatsappUrl: buildWhatsappUrl(whatsappMessage),
    }
  }

  const env = getServerEnv()
  if (!env.appUrl) {
    throw new ApiError(500, 'APP_URL_MISSING', 'APP_URL is not configured.')
  }

  const reference = `ULO-SUB-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  const callbackUrl = `${env.appUrl.replace(/\/$/, '')}/dashboard/subscriptions/callback`
  const initialized = await initializePaystackTransaction({
    email: actor.email,
    amount: plan.priceAmount * 100,
    reference,
    callbackUrl,
    metadata: {
      userId: actor.id,
      planId: plan.id,
    },
  })

  const pending = await createUserSubscription({
    userId: actor.id,
    planId: plan.id,
    status: 'pending',
    amount: plan.priceAmount,
    currency: 'NGN',
    billingInterval: plan.billingInterval,
    paymentProvider: 'paystack',
    paymentReference: reference,
    paystackAccessCode: initialized.access_code,
    paystackAuthorizationUrl: initialized.authorization_url,
  })

  if (!pending) {
    throw new ApiError(500, 'SUBSCRIPTION_INIT_FAILED', 'Unable to initialize subscription.')
  }

  return {
    paymentProvider: 'paystack' as const,
    authorizationUrl: initialized.authorization_url,
    reference,
  }
}

function calculateEndDate(plan: SubscriptionPlanRecord, start: Date) {
  const end = new Date(start)
  if (plan.billingInterval === 'year') {
    end.setFullYear(end.getFullYear() + 1)
  } else {
    end.setMonth(end.getMonth() + 1)
  }
  return end.toISOString()
}

export async function verifySubscriptionForUser(actor: AuthUser, reference: string) {
  const pending = await findUserSubscriptionByReference(reference)
  if (!pending || pending.userId !== actor.id) {
    throw new ApiError(404, 'SUBSCRIPTION_NOT_FOUND', 'Subscription transaction not found.')
  }

  const plan = await findSubscriptionPlanById(pending.planId)
  if (!plan) {
    throw new ApiError(404, 'PLAN_NOT_FOUND', 'Subscription plan not found.')
  }

  const verification = await verifyPaystackTransaction(reference)
  if (verification.status !== 'success') {
    throw new ApiError(400, 'PAYMENT_NOT_CONFIRMED', 'Payment has not been confirmed.')
  }

  const startsAt = new Date().toISOString()
  const endsAt = calculateEndDate(plan, new Date())

  await expireActiveUserSubscriptions(actor.id)
  const updated = await updateUserSubscription(pending.id, {
    status: 'active',
    startsAt,
    endsAt,
  })
  if (!updated) {
    throw new ApiError(500, 'SUBSCRIPTION_VERIFY_FAILED', 'Unable to activate subscription.')
  }
  return updated
}

export async function updateSubscriptionStatusForAdmin(actor: AuthUser, id: string, status: 'active' | 'expired' | 'cancelled') {
  requireAdmin(actor)
  const existing = await findUserSubscriptionById(id)
  if (!existing) {
    throw new ApiError(404, 'SUBSCRIPTION_NOT_FOUND', 'Subscription not found.')
  }

  let startsAt = existing.startsAt
  let endsAt = existing.endsAt

  if (status === 'active') {
    const plan = await findSubscriptionPlanById(existing.planId)
    if (!plan) {
      throw new ApiError(404, 'PLAN_NOT_FOUND', 'Subscription plan not found.')
    }

    startsAt = new Date().toISOString()
    endsAt = calculateEndDate(plan, new Date())
    await expireActiveUserSubscriptions(existing.userId)
  }

  const updated = await updateUserSubscription(id, { status, startsAt, endsAt })
  if (!updated) {
    throw new ApiError(404, 'SUBSCRIPTION_NOT_FOUND', 'Subscription not found.')
  }
  return updated
}

export async function deleteSubscriptionForAdmin(actor: AuthUser, id: string) {
  requireAdmin(actor)
  const existing = await findUserSubscriptionById(id)
  if (!existing) {
    throw new ApiError(404, 'SUBSCRIPTION_NOT_FOUND', 'Subscription not found.')
  }

  await deleteUserSubscription(id)
  return existing
}

export async function assertListingCapacity(actor: AuthUser, type: 'property' | 'hotel', currentCount: number) {
  if (actor.role === 'admin') return

  const { plan, subscription } = await getEffectiveSubscriptionForUser(actor.id)
  const limit = subscription
    ? (type === 'property' ? plan.propertyLimit : plan.hotelLimit)
    : getAdminListingLimit(actor, type)

  if (limit != null && limit >= 0 && currentCount >= limit) {
    throw new ApiError(
      403,
      'SUBSCRIPTION_LIMIT_REACHED',
      subscription
        ? `Your ${plan.name} plan allows ${limit} ${type === 'property' ? 'property' : 'hotel'} listing${limit === 1 ? '' : 's'}.`
        : `Your admin-assigned access allows ${limit} ${type === 'property' ? 'property' : 'hotel'} listing${limit === 1 ? '' : 's'}.`
    )
  }
}
