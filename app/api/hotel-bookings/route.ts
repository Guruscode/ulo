import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { listBookingsForScope } from '@/lib/server/hotels/service'

export async function GET(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { searchParams } = new URL(request.url)
    const scope = searchParams.get('scope') === 'admin' ? 'admin' : 'mine'
    const bookings = await listBookingsForScope(scope, actor)
    return apiSuccess({ bookings })
  })
}
