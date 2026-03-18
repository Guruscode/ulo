import AdminLayout from '@/components/admin/admin-layout'
import { AccountProfileContent } from '@/components/account/account-profile-content'

export default function AdminProfilePage() {
  return (
    <AdminLayout>
      <AccountProfileContent
        title="Admin Profile"
        description="View and update the personal details attached to your admin account."
        roleLabel="Administrator"
      />
    </AdminLayout>
  )
}
