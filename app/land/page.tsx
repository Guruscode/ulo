'use client'

import { Search, Video } from 'lucide-react'
import { useMemo, useState } from 'react'

import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import PropertyCard from '@/components/home/property-card'
import { usePublicHomeProperties } from '@/components/properties/use-public-home-properties'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PropertyGridSkeleton } from '@/components/ui/page-skeletons'

export default function LandPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { properties, loading } = usePublicHomeProperties()

  const filteredProperties = useMemo(() => {
    return properties
      .filter((property) => property.type === 'Land')
      .filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [properties, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <section className="bg-gradient-to-b from-secondary/10 to-transparent pt-16 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">Land For Sale</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover approved land opportunities for development and investment.</p>
          </div>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input placeholder="Search by location or title..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="flex-1" />
            <Button className="bg-secondary hover:bg-secondary/90 text-white"><Search className="w-4 h-4" /></Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-secondary to-secondary/80 text-white">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] items-center p-6 md:p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
                <Video className="h-4 w-4" />
                1 min neighbourhood view
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold">Preview the area before you inspect the land</h2>
              <p className="mt-4 max-w-2xl text-white/85">Watch a short neighbourhood overview to get a feel for access roads, surrounding development, and the general environment around these land listings.</p>
            </div>
            <div className="overflow-hidden rounded-2xl bg-black/20 ring-1 ring-white/15">
              <video controls preload="metadata" poster="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop" className="h-full w-full aspect-video object-cover">
                <source src="https://cdn.coverr.co/videos/coverr-aerial-view-of-a-city-1564840067797?download=1080p" type="video/mp4" />
              </video>
            </div>
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
            {searchQuery ? 'No properties found matching your search.' : 'No approved land properties at the moment.'}
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
