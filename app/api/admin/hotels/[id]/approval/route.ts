import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { setHotelApprovalForAdmin } from '@/lib/server/hotels/service'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const { id } = await params
    const hotel = await setHotelApprovalForAdmin(id, payload, actor)
    return apiSuccess({ hotel }, 'Hotel approval updated successfully.')
  })
}
