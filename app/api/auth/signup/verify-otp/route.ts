import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { verifySignupOtp } from '@/lib/server/auth/service'
import { setSessionCookie } from '@/lib/server/auth/session'
import { getDashboardPathForRole } from '@/lib/auth/redirects'

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const payload = await request.json()
    const { user, sessionToken } = await verifySignupOtp(payload)
    const response = apiSuccess(
      {
        user,
        redirectPath: getDashboardPathForRole(user.role),
      },
      'Account created successfully.',
      { status: 201 }
    )

    setSessionCookie(response, sessionToken)

    return response
  })
}
