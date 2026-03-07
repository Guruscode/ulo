import { notFound } from 'next/navigation'
import { use } from 'react'
import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import PropertyCard from '@/components/home/property-card'
import { homeEstates } from '@/lib/home-estates'
import { homeProperties } from '@/lib/home-properties'

export default function EstatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const estate = homeEstates.find((item) => item.slug === slug)

  if (!estate) {
    notFound()
  }

  const properties = homeProperties.filter((property) => property.estate === estate.name)

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      <section className="bg-gradient-to-b from-white via-white to-background pt-16 md:pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div
              className="w-full lg:w-1/2 h-72 rounded-2xl bg-cover bg-center shadow-xl"
              style={{ backgroundImage: `url(${estate.image})` }}
            />
            <div className="flex-1 space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-primary">Estate</p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
                {estate.name}
              </h1>
              <p className="text-lg text-muted-foreground">{estate.location}</p>
              <p className="text-muted-foreground">
                Explore available homes and properties within this estate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary">
            {properties.length} {properties.length === 1 ? 'Listing' : 'Listings'}
          </h2>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-lg">
            No properties are available in this estate yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <HomeFooter />
    </div>
  )
}
