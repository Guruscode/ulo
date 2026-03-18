import { z } from 'zod'

import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { ApiError } from '@/lib/server/http/api-error'
import { initializeSubscriptionCheckout } from '@/lib/server/subscriptions/service'

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const parsed = z.object({ planId: z.string().trim().min(1) }).safeParse(await request.json())
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Plan ID is required.', parsed.error.flatten())
    }
    const checkout = await initializeSubscriptionCheckout(actor, parsed.data.planId)
    return apiSuccess(checkout)
  })
}
