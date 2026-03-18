import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { saveProperty, unsaveProperty } from '@/lib/server/properties/service'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { id } = await params
    await saveProperty(actor, id)
    return apiSuccess({ success: true }, 'Property saved.')
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { id } = await params
    await unsaveProperty(actor, id)
    return apiSuccess({ success: true }, 'Property removed from saved.')
  })
}
