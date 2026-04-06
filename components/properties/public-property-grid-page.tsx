'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import PropertyCard from '@/components/home/property-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PropertyGridSkeleton } from '@/components/ui/page-skeletons'
import { usePublicHomeProperties } from '@/components/properties/use-public-home-properties'

type PublicPropertyGridMode =
  | 'for-sale'
  | 'for-rent'
  | 'shortlet'
  | 'apartments'

function filterByMode(mode: PublicPropertyGridMode, title: string, type: string) {
  if (mode === 'for-sale') return type === 'For Sale'
  if (mode === 'for-rent') return type === 'For Rent'
  if (mode === 'shortlet') return type === 'Shortlet'
  return title.toLowerCase().includes('apartment') || title.toLowerCase().includes('flat')
}

export function PublicPropertyGridPage({
  title,
  description,
  mode,
}: {
  title: string
  description: string
  mode: PublicPropertyGridMode
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const { properties, loading } = usePublicHomeProperties()

  const filteredProperties = useMemo(() => {
    return properties
      .filter((property) => filterByMode(mode, property.title, property.type))
      .filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [mode, properties, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      <section className="bg-gradient-to-b from-secondary/10 to-transparent pt-16 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
          </div>

          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder="Search by location or title..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="flex-1"
            />
            <Button className="bg-secondary hover:bg-secondary/90 text-white">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary">
            {loading ? <PropertyCountSkeleton /> : `${filteredProperties.length} ${filteredProperties.length === 1 ? 'Listing' : 'Listings'}`}
          </h2>
        </div>

        {loading ? (
          <PropertyGridSkeleton />
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-lg">
            {searchQuery ? 'No properties found matching your search.' : 'No approved properties available in this category yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <HomeFooter />
    </div>
  )
}

function PropertyCountSkeleton() {
  return <span className="block h-10 w-36 animate-pulse rounded-md bg-muted" aria-hidden="true" />
}
