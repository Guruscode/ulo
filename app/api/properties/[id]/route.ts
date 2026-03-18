import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { getCurrentUser } from '@/lib/server/auth/current-user'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import {
  deletePropertyForActor,
  getPropertyForActor,
  trackPropertyView,
  updatePropertyForActor,
} from '@/lib/server/properties/service'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withApiHandler(async () => {
    const { id } = await params
    const actor = await getCurrentUser()
    const property = await getPropertyForActor(id, actor)
    const forwardedFor = request.headers.get('x-forwarded-for') || ''
    const userAgent = request.headers.get('user-agent') || ''
    await trackPropertyView(id, actor, `${forwardedFor}:${userAgent}`.slice(0, 255))

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
