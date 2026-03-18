import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { updateUserForAdmin } from '@/lib/server/users/service'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const { id } = await params
    const user = await updateUserForAdmin(actor, id, payload)
    return apiSuccess({ user }, 'User updated successfully.')
  })
}
