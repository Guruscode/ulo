import { NextResponse } from 'next/server'

import type { ApiFailure, ApiSuccess } from '@/lib/auth/types'
import { ApiError } from '@/lib/server/http/api-error'

export function apiSuccess<T>(data: T, message?: string, init?: ResponseInit) {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    message,
  }

  return NextResponse.json(body, init)
}

export function apiFailure(error: ApiError) {
  const body: ApiFailure = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
    },
  }

  return NextResponse.json(body, { status: error.status })
}

export async function withApiHandler<T>(handler: () => Promise<NextResponse<T> | NextResponse>) {
  try {
    return await handler()
  } catch (error) {
    if (error instanceof ApiError) {
      return apiFailure(error)
    }

    console.error('[api] unexpected error', error)

    return apiFailure(
      new ApiError(500, 'INTERNAL_SERVER_ERROR', 'Something went wrong. Please try again.')
    )
  }
}
