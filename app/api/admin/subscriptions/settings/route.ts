import { z } from 'zod'

import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { ApiError } from '@/lib/server/http/api-error'
import { getSubscriptionPaymentMethod, setSubscriptionPaymentMethodForAdmin } from '@/lib/server/subscriptions/service'

export async function GET() {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    if (actor.role !== 'admin') {
      throw new ApiError(403, 'FORBIDDEN', 'Admin access is required.')
    }
    return apiSuccess({ method: await getSubscriptionPaymentMethod() })
  })
}

export async function PATCH(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const parsed = z.object({
      method: z.enum(['paystack', 'account']),
    }).safeParse(await request.json())

    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Please provide a valid payment method.', parsed.error.flatten())
    }

    const settings = await setSubscriptionPaymentMethodForAdmin(actor, parsed.data.method)
    return apiSuccess(settings, 'Subscription payment method updated.')
  })
}
