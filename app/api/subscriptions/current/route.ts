import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { getEffectiveSubscriptionForUser, getSubscriptionSettings } from '@/lib/server/subscriptions/service'

export async function GET() {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const [current, settings] = await Promise.all([
      getEffectiveSubscriptionForUser(actor.id),
      getSubscriptionSettings(),
    ])
    return apiSuccess({
      ...current,
      paymentMethod: settings.method,
      manualPayment: {
        bankName: settings.bankName,
        accountName: settings.accountName,
        accountNumber: settings.accountNumber,
      },
    })
  })
}
