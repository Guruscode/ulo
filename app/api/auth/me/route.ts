import { cookies } from 'next/headers'

import { ApiError } from '@/lib/server/http/api-error'
import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { getDashboardPathForRole } from '@/lib/auth/redirects'
import { getUserFromSessionToken, ensureAdminSeeded } from '@/lib/server/auth/service'
import { SESSION_COOKIE_NAME } from '@/lib/server/auth/session'

export async function GET() {
  return withApiHandler(async () => {
    await ensureAdminSeeded()

    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', 'You are not signed in.')
    }

    const user = await getUserFromSessionToken(token)

    return apiSuccess({
      user,
      redirectPath: getDashboardPathForRole(user.role),
    })
  })
}
