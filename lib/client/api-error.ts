import type { ApiFailure } from '@/lib/auth/types'

export class ApiClientError extends Error {
  status: number
  code: string
  details?: unknown

  constructor(status: number, payload: ApiFailure['error']) {
    super(payload.message)
    this.status = status
    this.code = payload.code
    this.details = payload.details
  }
}
