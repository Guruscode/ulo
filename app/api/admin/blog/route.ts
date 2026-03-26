import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { createBlogForAdmin, listBlogsForAdmin } from '@/lib/server/blog/service'

export async function GET(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { searchParams } = new URL(request.url)
    const blogs = await listBlogsForAdmin(actor, {
      limit: Number(searchParams.get('limit')) || 100,
      offset: Number(searchParams.get('offset')) || 0,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
    })
    return apiSuccess({ blogs })
  })
}

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const blog = await createBlogForAdmin(actor, payload)
    return apiSuccess({ blog }, 'Blog created successfully.')
  })
}
