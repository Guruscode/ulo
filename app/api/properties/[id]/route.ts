import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { getCurrentUser } from '@/lib/server/auth/current-user'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import {
  deletePropertyForActor,
  getPropertyForActor,
  updatePropertyForActor,
} from '@/lib/server/properties/service'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withApiHandler(async () => {
    const { id } = await params
    const actor = await getCurrentUser()
    const property = await getPropertyForActor(id, actor)

    return apiSuccess({ property })
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const { id } = await params
    const property = await updatePropertyForActor(id, payload, actor)

    return apiSuccess(
      { property },
      actor.role === 'admin'
        ? 'Property updated successfully.'
        : 'Property updated and queued for review.'
    )
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { id } = await params
    await deletePropertyForActor(id, actor)

    return apiSuccess({ success: true }, 'Property deleted successfully.')
  })
}
