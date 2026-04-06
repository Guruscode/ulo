import { z } from 'zod'

import { findPropertyVerificationPackage } from '@/lib/property-verification/types'
import { getCurrentUser } from '@/lib/server/auth/current-user'
import { getServerEnv } from '@/lib/server/config/env'
import { ApiError } from '@/lib/server/http/api-error'
import { sendPropertyVerificationTrackingEmail } from '@/lib/server/mail/notifications'
import { initializePaystackTransaction, verifyPaystackTransaction } from '@/lib/server/paystack/client'
import { updatePropertyVerificationStatus } from '@/lib/server/properties/repository'
import {
  createPropertyVerificationRequest,
  findPropertyVerificationRequestByReference,
  findPropertyVerificationRequestByTrackingCode,
  listPropertyVerificationRequestsByEmail,
  updatePropertyVerificationRequest,
} from '@/lib/server/property-verifications/repository'

const checkoutSchema = z.object({
  propertyId: z.string().trim().optional().nullable(),
  propertyTitle: z.string().trim().min(1, 'Property title is required.'),
  propertyLocation: z.string().trim().min(1, 'Property location is required.'),
  propertyAddress: z.string().trim().min(1, 'Property address is required.'),
  fullName: z.string().trim().min(2, 'Full name is required.'),
  email: z.string().trim().email('A valid email is required.'),
  phone: z.string().trim().min(7, 'Phone number is required.'),
  state: z.string().trim().min(2, 'State is required.'),
  area: z.string().trim().min(2, 'Area or LGA is required.'),
  goal: z.string().trim().optional().nullable(),
  packageId: z.enum(['basic', 'standard', 'premium']),
  titleDocumentType: z.string().trim().optional().nullable(),
  titleDocumentUrls: z.array(z.string().trim().url()).min(1, 'Title document is required.'),
  surveyPlanUrls: z.array(z.string().trim().url()).min(1, 'Survey plan is required.'),
  additionalDocumentUrls: z.array(z.string().trim().url()).optional().default([]),
})

const trackSchema = z.object({
  trackingCode: z.string().trim().optional().default(''),
  email: z.string().trim().optional().default(''),
})

function generateTrackingCode() {
  return `VP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

function generatePaymentReference() {
  return `ULO-VERIFY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

export async function initializePropertyVerificationCheckout(input: unknown) {
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Please complete the verification request form.', parsed.error.flatten())
  }

  const packageConfig = findPropertyVerificationPackage(parsed.data.packageId)
  if (!packageConfig) {
    throw new ApiError(400, 'PACKAGE_NOT_FOUND', 'Selected verification package is invalid.')
  }

  const env = getServerEnv()
  if (!env.appUrl) {
    throw new ApiError(500, 'APP_URL_MISSING', 'APP_URL is not configured.')
  }

  const actor = await getCurrentUser()
  const trackingCode = generateTrackingCode()
  const paymentReference = generatePaymentReference()
  const callbackUrl = `${env.appUrl.replace(/\/$/, '')}/api/property-verifications/callback`

  const initialized = await initializePaystackTransaction({
    email: parsed.data.email,
    amount: packageConfig.priceAmount * 100,
    reference: paymentReference,
    callbackUrl,
    metadata: {
      verificationTrackingCode: trackingCode,
      packageId: packageConfig.id,
      propertyId: parsed.data.propertyId ?? null,
      requesterEmail: parsed.data.email,
      requesterName: parsed.data.fullName,
      userId: actor?.id ?? null,
    },
  })

  const created = await createPropertyVerificationRequest({
    trackingCode,
    propertyId: parsed.data.propertyId ?? null,
    propertyTitle: parsed.data.propertyTitle,
    propertyLocation: parsed.data.propertyLocation,
    propertyAddress: parsed.data.propertyAddress,
    requesterUserId: actor?.id ?? null,
    requesterName: parsed.data.fullName,
    requesterEmail: parsed.data.email,
    requesterPhone: parsed.data.phone,
    state: parsed.data.state,
    area: parsed.data.area,
    goal: parsed.data.goal ?? null,
    packageId: packageConfig.id,
    packageName: packageConfig.name,
    amount: packageConfig.priceAmount,
    paymentReference,
    paymentStatus: 'pending',
    verificationStatus: 'payment_pending',
    titleDocumentType: parsed.data.titleDocumentType ?? null,
    titleDocumentUrls: parsed.data.titleDocumentUrls,
    surveyPlanUrls: parsed.data.surveyPlanUrls,
    additionalDocumentUrls: parsed.data.additionalDocumentUrls,
    paystackAccessCode: initialized.access_code,
    paystackAuthorizationUrl: initialized.authorization_url,
  })

  if (!created) {
    throw new ApiError(500, 'VERIFICATION_INIT_FAILED', 'Unable to initialize the verification request.')
  }

  return {
    authorizationUrl: initialized.authorization_url,
    reference: paymentReference,
    trackingCode,
    requestId: created.id,
  }
}

export async function verifyPropertyVerificationPayment(reference: string) {
  const request = await findPropertyVerificationRequestByReference(reference)
  if (!request) {
    throw new ApiError(404, 'VERIFICATION_NOT_FOUND', 'Verification payment record not found.')
  }

  if (request.paymentStatus === 'paid') {
    return request
  }

  const verification = await verifyPaystackTransaction(reference)
  if (verification.status !== 'success') {
    throw new ApiError(400, 'PAYMENT_NOT_CONFIRMED', 'Payment has not been confirmed.')
  }

  const paidAt = verification.paid_at || new Date().toISOString()
  const updated = await updatePropertyVerificationRequest(request.id, {
    paymentStatus: 'paid',
    verificationStatus: 'submitted',
    paidAt,
  })

  if (!updated) {
    throw new ApiError(500, 'VERIFICATION_VERIFY_FAILED', 'Unable to update the verification request.')
  }

  if (updated.propertyId) {
    await updatePropertyVerificationStatus(updated.propertyId, 'requested')
  }

  await sendPropertyVerificationTrackingEmail(updated)
  return updated
}

export async function trackPropertyVerification(input: unknown) {
  const parsed = trackSchema.safeParse(input)
  if (!parsed.success) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Tracking code or email is required.')
  }

  const trackingCode = parsed.data.trackingCode.trim()
  const email = parsed.data.email.trim().toLowerCase()

  if (!trackingCode && !email) {
    throw new ApiError(400, 'TRACKING_INPUT_REQUIRED', 'Enter a tracking code or email.')
  }

  if (trackingCode) {
    const request = await findPropertyVerificationRequestByTrackingCode(trackingCode)
    if (!request) {
      throw new ApiError(404, 'TRACKING_NOT_FOUND', 'No verification request was found for that tracking code.')
    }
    return [request]
  }

  const requests = await listPropertyVerificationRequestsByEmail(email)
  if (requests.length === 0) {
    throw new ApiError(404, 'TRACKING_NOT_FOUND', 'No verification request was found for that email.')
  }
  return requests
}
