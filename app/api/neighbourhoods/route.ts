import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { listNeighbourhoods } from '@/lib/server/neighbourhoods/service'

export async function GET() {
  return withApiHandler(async () => {
    const neighbourhoods = await listNeighbourhoods()
    return apiSuccess({ neighbourhoods })
  })
}
