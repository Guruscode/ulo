'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import PropertyCard from '@/components/home/property-card'
import { homeProperties } from '@/lib/home-properties'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

function ShortletPageContent() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  const shortletProperties = homeProperties
    .filter(
      (property) =>
        property.type?.toLowerCase().includes('shortlet') ||
        property.title?.toLowerCase().includes('shortlet')
    )
    .filter(
      (property) =>
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <>
      <HomeNav />
      <main className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-secondary to-secondary/80 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Shortlet Properties</h1>
            <p className="text-white/80 text-lg max-w-2xl">
              Find the perfect shortlet accommodation for your needs
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="bg-white border-b py-8 px-4 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-secondary hover:bg-secondary/90">Search</Button>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {shortletProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">
                  No shortlet properties found matching your search.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-8">
                  Showing {shortletProperties.length} property/properties
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {shortletProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  )
}

export default function ShortletPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShortletPageContent />
    </Suspense>
  )
}
