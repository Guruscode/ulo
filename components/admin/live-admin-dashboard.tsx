'use client'

import { useEffect, useState } from 'react'
import { Building2, CalendarDays, Home, Loader2, Users } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { dashboardStatsRequest, type AdminDashboardStats } from '@/lib/client/dashboard-client'

export function LiveAdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      const response = await dashboardStatsRequest()
      if (response.role === 'admin') {
        setStats(response.stats)
      }
    }
    void loadStats()
  }, [])

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, detail: 'Registered accounts', icon: Users },
    { label: 'Properties', value: stats?.totalProperties ?? 0, detail: `${stats?.pendingProperties ?? 0} pending review`, icon: Home },
    { label: 'Hotels', value: stats?.totalHotels ?? 0, detail: `${stats?.pendingHotels ?? 0} pending review`, icon: Building2 },
    { label: 'Bookings', value: stats?.totalBookings ?? 0, detail: 'Hotel reservation requests', icon: CalendarDays },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label} className="bg-white p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                {stats ? card.value : <Loader2 className="h-7 w-7 animate-spin text-slate-400" />}
              </p>
              <p className="mt-1 text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-xs font-medium text-slate-600">{card.detail}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
