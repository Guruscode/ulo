import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { setPropertyApprovalForAdmin } from '@/lib/server/properties/service'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const { id } = await params
    const property = await setPropertyApprovalForAdmin(id, payload, actor)

    return apiSuccess({ property }, 'Property approval updated successfully.')
  })
}
