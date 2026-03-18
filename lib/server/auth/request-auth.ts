import { cookies } from 'next/headers'

import { ApiError } from '@/lib/server/http/api-error'
import { getUserFromSessionToken } from '@/lib/server/auth/service'
import { SESSION_COOKIE_NAME } from '@/lib/server/auth/session'

export async function requireAuthenticatedUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    throw new ApiError(401, 'UNAUTHORIZED', 'You are not signed in.')
  }

  return getUserFromSessionToken(token)
}
