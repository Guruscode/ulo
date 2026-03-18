import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requestSignupOtp } from '@/lib/server/auth/service'

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const payload = await request.json()
    const signupRequest = await requestSignupOtp(payload)
    return apiSuccess(signupRequest, 'Verification code sent successfully.', { status: 201 })
  })
}
