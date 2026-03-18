import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { listSubscriptionsForActor } from '@/lib/server/subscriptions/service'

export async function GET() {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const subscriptions = await listSubscriptionsForActor(actor)
    return apiSuccess({ subscriptions })
  })
}
