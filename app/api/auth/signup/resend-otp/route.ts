import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { resendSignupOtp } from '@/lib/server/auth/service'

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const payload = await request.json()
    const signupRequest = await resendSignupOtp(payload)
    return apiSuccess(signupRequest, 'Verification code resent successfully.')
  })
}
