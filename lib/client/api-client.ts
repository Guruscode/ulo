import type { ApiResponse } from '@/lib/auth/types'
import { ApiClientError } from '@/lib/client/api-error'

export async function apiRequest<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include',
  })

  const payload = (await response.json()) as ApiResponse<T>

  if (!response.ok || !payload.success) {
    throw new ApiClientError(
      response.status,
      payload.success
        ? { code: 'UNKNOWN_ERROR', message: 'Something went wrong.' }
        : payload.error
    )
  }

  return payload.data
}
