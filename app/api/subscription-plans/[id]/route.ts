import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { deletePlanForAdmin, savePlanForAdmin } from '@/lib/server/subscriptions/service'

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

export async function DELETE(request: Request, context: Params) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { id } = await context.params
    await deletePlanForAdmin(actor, id)
    return apiSuccess({}, 'Subscription plan deleted successfully.')
  })
}
