import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { getCurrentUser } from '@/lib/server/auth/current-user'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { deleteHotelForActor, getHotelForActor, updateHotelForActor } from '@/lib/server/hotels/service'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await getCurrentUser()
    const { id } = await params
    const hotel = await getHotelForActor(id, actor)
    return apiSuccess({ hotel })
  })
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const { id } = await params
    const hotel = await updateHotelForActor(id, payload, actor)
    return apiSuccess({ hotel }, actor.role === 'admin' ? 'Hotel updated successfully.' : 'Hotel updated and queued for review.')
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { id } = await params
    await deleteHotelForActor(id, actor)
    return apiSuccess({ success: true }, 'Hotel deleted successfully.')
  })
}
