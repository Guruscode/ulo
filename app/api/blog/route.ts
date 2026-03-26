import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { listBlogs } from '@/lib/server/blog/service'

export async function GET(request: Request) {
  return withApiHandler(async () => {
    const { searchParams } = new URL(request.url)
    const blogs = await listBlogs({
      limit: Number(searchParams.get('limit')) || 20,
      offset: Number(searchParams.get('offset')) || 0,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || 'published',
      search: searchParams.get('search') || undefined,
    })

    return apiSuccess({ blogs })
  })
}
