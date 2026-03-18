import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { savePlanForAdmin } from '@/lib/server/subscriptions/service'

type Params = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: Params) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const { id } = await context.params
    const plan = await savePlanForAdmin(actor, payload, id)
    return apiSuccess({ plan }, 'Subscription plan updated successfully.')
  })
}
