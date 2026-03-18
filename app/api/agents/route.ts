import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { listPublicAgents } from '@/lib/server/users/service'

export async function GET() {
  return withApiHandler(async () => {
    const agents = await listPublicAgents()
    return apiSuccess({ agents })
  })
}
