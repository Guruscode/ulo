import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { initializePropertyVerificationCheckout } from '@/lib/server/property-verifications/service'

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const checkout = await initializePropertyVerificationCheckout(await request.json())
    return apiSuccess(checkout)
  })
}
