import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { getCurrentUser } from '@/lib/server/auth/current-user'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { listPlansForActor, savePlanForAdmin } from '@/lib/server/subscriptions/service'

export async function GET() {
  return withApiHandler(async () => {
    const actor = await getCurrentUser()
    const plans = await listPlansForActor(actor)
    return apiSuccess({ plans })
  })
}

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const plan = await savePlanForAdmin(actor, payload)
    return apiSuccess({ plan }, 'Subscription plan created successfully.')
  })
}
