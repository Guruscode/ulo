import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { addCommentToBlogSlug, listCommentsForBlogSlug } from '@/lib/server/blog/service'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return withApiHandler(async () => {
    const { slug } = await params
    const comments = await listCommentsForBlogSlug(slug)
    return apiSuccess({ comments })
  })
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const { slug } = await params
    const comment = await addCommentToBlogSlug(actor, slug, payload)
    return apiSuccess({ comment }, 'Comment added successfully.')
  })
}
