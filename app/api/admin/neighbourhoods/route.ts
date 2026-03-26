import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { createNeighbourhoodForAdmin, listNeighbourhoodsForAdmin } from '@/lib/server/neighbourhoods/service'

export async function GET() {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const neighbourhoods = await listNeighbourhoodsForAdmin(actor)
    return apiSuccess({ neighbourhoods })
  })
}

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const neighbourhood = await createNeighbourhoodForAdmin(actor, payload)
    return apiSuccess({ neighbourhood }, 'Neighbourhood created successfully.')
  })
}
