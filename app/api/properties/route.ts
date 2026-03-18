import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { getCurrentUser } from '@/lib/server/auth/current-user'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { createPropertyForActor, listPropertiesForScope } from '@/lib/server/properties/service'
import type { PropertyScope } from '@/lib/properties/types'

function getScope(searchParams: URLSearchParams): PropertyScope {
  const scope = searchParams.get('scope')
  return scope === 'mine' || scope === 'admin' ? scope : 'public'
}

export async function GET(request: Request) {
  return withApiHandler(async () => {
    const { searchParams } = new URL(request.url)
    const scope = getScope(searchParams)
    const actor = await getCurrentUser()
    const properties = await listPropertiesForScope(
      scope,
      {
        search: searchParams.get('search') || undefined,
        type: searchParams.get('type') || undefined,
        status: searchParams.get('status') || undefined,
        approvalStatus: searchParams.get('approvalStatus') || undefined,
        limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
      },
      actor
    )

    return apiSuccess({ properties })
  })
}

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const payload = await request.json()
    const property = await createPropertyForActor(payload, actor)

    return apiSuccess(
      { property },
      actor.role === 'admin'
        ? 'Property created successfully.'
        : 'Property created and submitted for admin approval.'
    )
  })
}
