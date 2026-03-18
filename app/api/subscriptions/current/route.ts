import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { getEffectiveSubscriptionForUser } from '@/lib/server/subscriptions/service'

export async function GET() {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const current = await getEffectiveSubscriptionForUser(actor.id)
    return apiSuccess(current)
  })
}
