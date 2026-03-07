'use client'

import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import PropertyCard from '@/components/home/property-card'
import { homeProperties } from '@/lib/home-properties'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Search } from 'lucide-react'

export default function ForSalePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const forSaleProperties = homeProperties.filter(
    (property) => property.type === 'For Sale'
  )

  const filteredProperties = forSaleProperties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/10 to-transparent pt-16 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
              Properties For Sale
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover premium properties available for purchase. Find your dream home from our curated selection.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder="Search by location or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-secondary hover:bg-secondary/90 text-white">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'Listing' : 'Listings'}
          </h2>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-lg">
            {searchQuery ? 'No properties found matching your search.' : 'No properties for sale at the moment.'}
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
