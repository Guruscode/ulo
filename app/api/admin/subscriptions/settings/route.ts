import { z } from 'zod'

import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { ApiError } from '@/lib/server/http/api-error'
import { getSubscriptionSettings, updateSubscriptionSettingsForAdmin } from '@/lib/server/subscriptions/service'

export async function GET() {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    if (actor.role !== 'admin') {
      throw new ApiError(403, 'FORBIDDEN', 'Admin access is required.')
    }
    return apiSuccess(await getSubscriptionSettings())
  })
}

export async function PATCH(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const parsed = z.object({
      method: z.enum(['paystack', 'account']),
      bankName: z.string().trim().min(2),
      accountName: z.string().trim().min(2),
      accountNumber: z.string().trim().min(6),
    }).safeParse(await request.json())

    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Please provide a valid payment method.', parsed.error.flatten())
    }

    const settings = await updateSubscriptionSettingsForAdmin(actor, parsed.data)
    return apiSuccess(settings, 'Subscription payment method updated.')
  })
}
