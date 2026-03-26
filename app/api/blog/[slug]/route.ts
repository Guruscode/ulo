import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { getPublishedBlogBySlug } from '@/lib/server/blog/service'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return withApiHandler(async () => {
    const { slug } = await params
    const blog = await getPublishedBlogBySlug(slug)
    return apiSuccess({ blog })
  })
}
