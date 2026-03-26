import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { deleteNeighbourhoodForAdmin, updateNeighbourhoodForAdmin } from '@/lib/server/neighbourhoods/service'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const { id } = await params
    const neighbourhood = await updateNeighbourhoodForAdmin(actor, id, payload)
    return apiSuccess({ neighbourhood }, 'Neighbourhood updated successfully.')
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { id } = await params
    await deleteNeighbourhoodForAdmin(actor, id)
    return apiSuccess({}, 'Neighbourhood deleted successfully.')
  })
}
