import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { clearSessionCookie } from '@/lib/server/auth/session'

export async function POST() {
  return withApiHandler(async () => {
    const response = apiSuccess({ success: true }, 'Signed out successfully.')
    clearSessionCookie(response)
    return response
  })
}
