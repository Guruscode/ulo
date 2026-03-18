import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { updateBookingStatusForActor } from '@/lib/server/hotels/service'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const { id } = await params
    const booking = await updateBookingStatusForActor(id, payload.status, actor)
    return apiSuccess({ booking }, 'Booking status updated successfully.')
  })
}
