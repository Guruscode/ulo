import { cookies } from 'next/headers'

import { getUserFromSessionToken } from '@/lib/server/auth/service'
import { SESSION_COOKIE_NAME } from '@/lib/server/auth/session'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    return await getUserFromSessionToken(token)
  } catch (_error) {
    return null
  }
}
