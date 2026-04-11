import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { getServerEnv } from '@/lib/server/config/env'
import { getEffectiveSubscriptionForUser, getSubscriptionPaymentMethod } from '@/lib/server/subscriptions/service'

export async function GET() {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const [current, paymentMethod] = await Promise.all([
      getEffectiveSubscriptionForUser(actor.id),
      getSubscriptionPaymentMethod(),
    ])
    const env = getServerEnv()
    return apiSuccess({
      ...current,
      paymentMethod,
      manualPayment: {
        bankName: env.subscriptionBankName || 'Access Bank',
        accountName: env.subscriptionAccountName || 'ULO TECHNOLOGIES',
        accountNumber: env.subscriptionAccountNumber || '0012345678',
      },
    })
  })
}
