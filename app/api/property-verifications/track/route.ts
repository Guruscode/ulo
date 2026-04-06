import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { trackPropertyVerification } from '@/lib/server/property-verifications/service'

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const requests = await trackPropertyVerification(await request.json())
    return apiSuccess({ requests })
  })
}
