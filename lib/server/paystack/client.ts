import { ApiError } from '@/lib/server/http/api-error'
import { getServerEnv } from '@/lib/server/config/env'

async function paystackRequest<T>(path: string, init?: RequestInit) {
  const env = getServerEnv()
  if (!env.paystackSecretKey) {
    throw new ApiError(500, 'PAYSTACK_NOT_CONFIGURED', 'Paystack is not configured.')
  }

  const response = await fetch(`https://api.paystack.co${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.paystackSecretKey}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  const payload = (await response.json()) as { status: boolean; message: string; data?: T }
  if (!response.ok || !payload.status || !payload.data) {
    throw new ApiError(502, 'PAYSTACK_REQUEST_FAILED', payload.message || 'Unable to process payment request.')
  }

  return payload.data
}

export function initializePaystackTransaction(input: {
  email: string
  amount: number
  reference: string
  callbackUrl: string
  metadata?: Record<string, unknown>
}) {
  return paystackRequest<{
    authorization_url: string
    access_code: string
    reference: string
  }>('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: input.email,
      amount: input.amount,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  })
}

export function verifyPaystackTransaction(reference: string) {
  return paystackRequest<{
    status: string
    amount: number
    reference: string
    paid_at?: string
    customer?: { email?: string }
  }>(`/transaction/verify/${reference}`, {
    method: 'GET',
  })
}
