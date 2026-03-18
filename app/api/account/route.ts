import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { setSessionCookie } from '@/lib/server/auth/session'
import { updateAuthenticatedUserProfile } from '@/lib/server/auth/service'

export async function GET() {
  return withApiHandler(async () => {
    const user = await requireAuthenticatedUser()

    return apiSuccess({ user })
  })
}

export async function PUT(request: Request) {
  return withApiHandler(async () => {
    const currentUser = await requireAuthenticatedUser()
    const payload = await request.json()
    const { user, sessionToken } = await updateAuthenticatedUserProfile(currentUser.id, payload)

    const response = apiSuccess({ user }, 'Account settings saved successfully.')
    setSessionCookie(response, sessionToken)

    return response
  })
}
