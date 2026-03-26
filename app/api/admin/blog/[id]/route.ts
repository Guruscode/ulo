import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { deleteBlogForAdmin, updateBlogForAdmin } from '@/lib/server/blog/service'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const { id } = await params
    const blog = await updateBlogForAdmin(actor, id, payload)
    return apiSuccess({ blog }, 'Blog updated successfully.')
  })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { id } = await params
    await deleteBlogForAdmin(actor, id)
    return apiSuccess({}, 'Blog deleted successfully.')
  })
}
