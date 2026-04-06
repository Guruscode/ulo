import type { PropertyVerificationRequestRecord } from '@/lib/property-verification/types'
import { apiRequest } from '@/lib/client/api-client'

export function initializePropertyVerificationCheckoutRequest(input: {
  propertyId?: string | null
  propertyTitle: string
  propertyLocation: string
  propertyAddress: string
  fullName: string
  email: string
  phone: string
  state: string
  area: string
  goal?: string | null
  packageId: 'basic' | 'standard' | 'premium'
  titleDocumentType?: string | null
  titleDocumentUrls: string[]
  surveyPlanUrls: string[]
  additionalDocumentUrls?: string[]
}) {
  return apiRequest<{
    authorizationUrl: string
    reference: string
    trackingCode: string
    requestId: string
  }>('/api/property-verifications/checkout', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function verifyPropertyVerificationPaymentRequest(reference: string) {
  return apiRequest<{ request: PropertyVerificationRequestRecord }>('/api/property-verifications/verify', {
    method: 'POST',
    body: JSON.stringify({ reference }),
  })
}

export function trackPropertyVerificationRequest(input: { trackingCode?: string; email?: string }) {
  return apiRequest<{ requests: PropertyVerificationRequestRecord[] }>('/api/property-verifications/track', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
