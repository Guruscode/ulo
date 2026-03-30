import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { deleteNotificationForUser } from '@/lib/server/notifications/service'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { id } = await params
    await deleteNotificationForUser(actor, id)
    return apiSuccess({}, 'Notification deleted successfully.')
  })
}
