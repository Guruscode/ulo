import { z } from 'zod'

import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { ApiError } from '@/lib/server/http/api-error'
import { updateSubscriptionStatusForAdmin } from '@/lib/server/subscriptions/service'

type Params = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, context: Params) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const parsed = z
      .object({
        status: z.enum(['active', 'expired', 'cancelled']),
      })
      .safeParse(await request.json())
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'A valid subscription status is required.', parsed.error.flatten())
    }
    const { id } = await context.params
    const subscription = await updateSubscriptionStatusForAdmin(actor, id, parsed.data.status)
    return apiSuccess({ subscription }, 'Subscription updated successfully.')
  })
}
