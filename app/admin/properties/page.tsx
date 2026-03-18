import AdminLayout from '@/components/admin/admin-layout'
import { PropertyManager } from '@/components/properties/property-manager'

export default function AdminPropertiesPage() {
  return (
    <AdminLayout>
      <PropertyManager mode="admin" />
    </AdminLayout>
  )
}
