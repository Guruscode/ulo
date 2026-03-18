import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { getCurrentUser } from '@/lib/server/auth/current-user'
import { createBookingForHotel } from '@/lib/server/hotels/service'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await getCurrentUser()
    const payload = await request.json()
    const { id } = await params
    const booking = await createBookingForHotel(id, payload, actor)
    return apiSuccess({ booking }, 'Booking request submitted successfully.')
  })
}
