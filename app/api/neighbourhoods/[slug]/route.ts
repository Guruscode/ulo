import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { getNeighbourhoodBySlug } from '@/lib/server/neighbourhoods/service'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return withApiHandler(async () => {
    const { slug } = await params
    const neighbourhood = await getNeighbourhoodBySlug(slug)
    return apiSuccess({ neighbourhood })
  })
}
