import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { listNotificationsForUser } from '@/lib/server/notifications/service'

export async function GET() {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const notifications = await listNotificationsForUser(actor)
    return apiSuccess({ notifications })
  })
}
