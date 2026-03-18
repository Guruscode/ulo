import { apiRequest } from '@/lib/client/api-client'

export type UserDashboardStats = {
  totalProperties: number
  approvedProperties: number
  pendingProperties: number
  totalHotels: number
  approvedHotels: number
  hotelBookings: number
}

export type AdminDashboardStats = {
  totalUsers: number
  totalProperties: number
  pendingProperties: number
  totalHotels: number
  pendingHotels: number
  totalBookings: number
}

export type DashboardStatsResponse =
  | {
      role: 'user'
      stats: UserDashboardStats
    }
  | {
      role: 'admin'
      stats: AdminDashboardStats
    }

export function dashboardStatsRequest() {
  return apiRequest<DashboardStatsResponse>('/api/dashboard/stats', { method: 'GET' })
}
