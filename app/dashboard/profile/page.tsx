import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { AccountProfileContent } from '@/components/account/account-profile-content'

export default function DashboardProfilePage() {
  return (
    <DashboardLayout>
      <AccountProfileContent
        title="My Profile"
        description="View and update the personal details attached to your dashboard account."
        roleLabel="Dashboard User"
      />
    </DashboardLayout>
  )
}
