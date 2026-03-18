import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { updateAuthenticatedUserPassword } from '@/lib/server/auth/service'

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const currentUser = await requireAuthenticatedUser()
    const payload = await request.json()

    await updateAuthenticatedUserPassword(currentUser.id, payload)

    return apiSuccess({ success: true }, 'Password updated successfully.')
  })
}
