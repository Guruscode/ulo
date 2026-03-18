import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { listSavedProperties } from '@/lib/server/properties/service'

export async function GET() {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const properties = await listSavedProperties(actor)
    return apiSuccess({ properties })
  })
}
