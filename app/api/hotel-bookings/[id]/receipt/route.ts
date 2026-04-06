import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { submitHotelBookingReceipt } from '@/lib/server/hotels/service'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const payload = await request.json()
    const { id } = await params
    const booking = await submitHotelBookingReceipt(id, payload)
    return apiSuccess({ booking }, 'Payment receipt submitted successfully.')
  })
}
