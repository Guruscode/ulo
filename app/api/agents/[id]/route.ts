import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { getPublicAgentById } from '@/lib/server/users/service'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(async () => {
    const { id } = await params
    const agent = await getPublicAgentById(id)
    return apiSuccess({ agent })
  })
}
