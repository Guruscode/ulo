import { redirect } from 'next/navigation'

import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { HotelManager } from '@/components/hotels/hotel-manager'
import { getCurrentUser } from '@/lib/server/auth/current-user'

export default async function DashboardHotelsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'admin' && user.accountType !== 'agent' && user.accountType !== 'hotel_manager') {
    redirect('/dashboard')
  }

  return (
    <DashboardLayout>
      <HotelManager mode="dashboard" />
    </DashboardLayout>
  )
}
