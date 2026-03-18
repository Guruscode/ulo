import { z } from 'zod'

import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { ApiError } from '@/lib/server/http/api-error'
import { verifySubscriptionForUser } from '@/lib/server/subscriptions/service'

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const parsed = z.object({ reference: z.string().trim().min(1) }).safeParse(await request.json())
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Reference is required.', parsed.error.flatten())
    }
    const subscription = await verifySubscriptionForUser(actor, parsed.data.reference)
    return apiSuccess({ subscription }, 'Subscription activated successfully.')
  })
}
