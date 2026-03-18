import AdminLayout from '@/components/admin/admin-layout'
import { HotelManager } from '@/components/hotels/hotel-manager'

export default function AdminHotelsPage() {
  return (
    <AdminLayout>
      <HotelManager mode="admin" />
    </AdminLayout>
  )
}
