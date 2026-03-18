import { PublicPropertyGridPage } from '@/components/properties/public-property-grid-page'

export default function ShortletPage() {
  return (
    <PublicPropertyGridPage
      title="Shortlet Properties"
      description="Find approved shortlet listings with live availability."
      mode="shortlet"
    />
  )
}
