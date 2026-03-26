import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { deleteBlogCommentForUser } from '@/lib/server/blog/service'

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { id } = await params
    await deleteBlogCommentForUser(actor, id)
    return apiSuccess({}, 'Comment deleted successfully.')
  })
}
