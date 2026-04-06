import { z } from 'zod'

import { ApiError } from '@/lib/server/http/api-error'
import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { verifyPropertyVerificationPayment } from '@/lib/server/property-verifications/service'

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const parsed = z.object({ reference: z.string().trim().min(1) }).safeParse(await request.json())
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Reference is required.', parsed.error.flatten())
    }
    const verificationRequest = await verifyPropertyVerificationPayment(parsed.data.reference)
    return apiSuccess({ request: verificationRequest }, 'Verification payment confirmed.')
  })
}
