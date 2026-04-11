import { redirect } from 'next/navigation'

import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { PropertyManager } from '@/components/properties/property-manager'
import { getCurrentUser } from '@/lib/server/auth/current-user'

export default async function DashboardPropertiesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <DashboardLayout>
      <PropertyManager mode="dashboard" />
    </DashboardLayout>
  )
}
