import AdminLayout from '@/components/admin/admin-layout'
import { UserManagement } from '@/components/admin/user-management'

export default function AdminAgentsPage() {
  return (
    <AdminLayout>
      <UserManagement mode="agents" />
    </AdminLayout>
  )
}
