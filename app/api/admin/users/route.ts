import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { listUsersForAdmin } from '@/lib/server/users/service'

export async function GET(request: Request) {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    const { searchParams } = new URL(request.url)
    const users = await listUsersForAdmin(actor, {
      search: searchParams.get('search') || undefined,
      accountType: searchParams.get('accountType') || undefined,
      approvalStatus: searchParams.get('approvalStatus') || undefined,
    })
    return apiSuccess({ users })
  })
}
