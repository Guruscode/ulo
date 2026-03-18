import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { getCurrentUser } from '@/lib/server/auth/current-user'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { createHotelForActor, listHotelsForScope } from '@/lib/server/hotels/service'

export async function GET(request: Request) {
  return withApiHandler(async () => {
    const { searchParams } = new URL(request.url)
    const scope = searchParams.get('scope') === 'mine' || searchParams.get('scope') === 'admin'
      ? (searchParams.get('scope') as 'mine' | 'admin')
      : 'public'
    const actor = await getCurrentUser()
    const hotels = await listHotelsForScope(scope, actor, {
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      approvalStatus: searchParams.get('approvalStatus') || undefined,
    })
    return apiSuccess({ hotels })
  })
}

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const hotel = await createHotelForActor(payload, actor)
    return apiSuccess({ hotel }, actor.role === 'admin' ? 'Hotel created successfully.' : 'Hotel created and submitted for admin approval.')
  })
}
