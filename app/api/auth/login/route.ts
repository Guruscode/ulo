import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { loginUser } from '@/lib/server/auth/service'
import { setSessionCookie } from '@/lib/server/auth/session'
import { getDashboardPathForRole } from '@/lib/auth/redirects'

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const payload = await request.json()
    const { user, sessionToken } = await loginUser(payload)
    const response = apiSuccess(
      {
        user,
        redirectPath: getDashboardPathForRole(user.role),
      },
      'Signed in successfully.'
    )

    setSessionCookie(response, sessionToken)

    return response
  })
}
