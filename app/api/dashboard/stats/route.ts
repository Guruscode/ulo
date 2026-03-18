import { apiSuccess, withApiHandler } from '@/lib/server/http/responses'
import { requireAuthenticatedUser } from '@/lib/server/auth/request-auth'
import { getAdminDashboardStats, getUserDashboardStats } from '@/lib/server/dashboard/stats'

export async function GET() {
  return withApiHandler(async () => {
    const actor = await requireAuthenticatedUser()
    if (actor.role === 'admin') {
      const stats = await getAdminDashboardStats()
      return apiSuccess({ role: 'admin', stats })
    }

    const stats = await getUserDashboardStats(actor.id)
    return apiSuccess({ role: 'user', stats })
  })
}
