import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { PropertyManager } from '@/components/properties/property-manager'

export default function DashboardPropertiesPage() {
  return (
    <DashboardLayout>
      <PropertyManager mode="dashboard" />
    </DashboardLayout>
  )
}
