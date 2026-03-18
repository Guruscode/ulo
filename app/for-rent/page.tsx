import { PublicPropertyGridPage } from '@/components/properties/public-property-grid-page'

export default function ForRentPage() {
  return (
    <PublicPropertyGridPage
      title="Properties For Rent"
      description="Browse approved rental properties with current availability."
      mode="for-rent"
    />
  )
}
