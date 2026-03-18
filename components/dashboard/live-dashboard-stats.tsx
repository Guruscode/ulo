'use client'

import { useEffect, useState } from 'react'
import { Building2, CalendarDays, CheckCircle2, Loader2 } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { dashboardStatsRequest, type UserDashboardStats } from '@/lib/client/dashboard-client'

export default function LiveDashboardStats() {
  const [stats, setStats] = useState<UserDashboardStats | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      const response = await dashboardStatsRequest()
      if (response.role === 'user') {
        setStats(response.stats)
      }
    }
    void loadStats()
  }, [])

  const cards = [
    { label: 'Total Properties', value: stats?.totalProperties ?? 0, change: `${stats?.pendingProperties ?? 0} pending review`, icon: Building2, color: 'from-blue-500 to-blue-600' },
    { label: 'Approved Properties', value: stats?.approvedProperties ?? 0, change: 'Live on the public site', icon: CheckCircle2, color: 'from-green-500 to-green-600' },
    { label: 'Total Hotels', value: stats?.totalHotels ?? 0, change: `${stats?.approvedHotels ?? 0} approved`, icon: Building2, color: 'from-purple-500 to-purple-600' },
    { label: 'Hotel Bookings', value: stats?.hotelBookings ?? 0, change: 'Across your hotels', icon: CalendarDays, color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label} className="bg-white p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats ? card.value : <Loader2 className="h-7 w-7 animate-spin text-gray-400" />}
                </p>
                <p className="text-green-600 text-xs font-medium mt-2">{card.change}</p>
              </div>
              <div className={`bg-gradient-to-br ${card.color} p-3 rounded-lg text-white`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
