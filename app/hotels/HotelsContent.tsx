'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapPin, Search, Star } from 'lucide-react'

import HomeFooter from '@/components/home/home-footer'
import { usePublicHotels } from '@/components/hotels/use-public-hotels'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { HotelGridSkeleton } from '@/components/ui/page-skeletons'
import { formatHotelPrice } from '@/lib/hotels/presentation'

export default function HotelsContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '')
  const { hotels, loading } = usePublicHotels()

  const filteredHotels = useMemo(() => {
    return hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [hotels, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-b from-secondary/10 to-transparent pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-serif font-bold text-secondary md:text-5xl">Hotels & Accommodation</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Discover approved hotels across Nigeria with live room inventory and reservation requests.
            </p>
          </div>
          <div className="mx-auto flex max-w-md gap-2">
            <Input
              placeholder="Search by location or hotel name..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="flex-1"
            />
            <Button className="bg-secondary text-white hover:bg-secondary/90">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-serif font-bold text-secondary md:text-4xl">
            {loading ? <HotelCountSkeleton /> : `${filteredHotels.length} ${filteredHotels.length === 1 ? 'Hotel' : 'Hotels'}`}
          </h2>
        </div>
        {loading ? (
          <HotelGridSkeleton />
        ) : filteredHotels.length === 0 ? (
          <div className="py-20 text-center text-lg text-muted-foreground">
            {searchQuery ? 'No hotels found matching your search.' : 'No approved hotels available at the moment.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredHotels.map((hotel) => (
              <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                <Card className="group h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold">{hotel.rating}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 text-lg font-bold text-secondary transition-colors group-hover:text-secondary/80">
                      {hotel.name}
                    </h3>
                    <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {hotel.location}
                    </div>
                    <div className="mb-4 flex flex-wrap gap-3">
                      {hotel.amenities.slice(0, 4).map((amenity) => (
                        <span key={amenity} className="rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-baseline justify-between border-t pt-3">
                      <div>
                        <span className="text-2xl font-bold text-secondary">{formatHotelPrice(hotel.priceValue)}</span>
                        <span className="text-sm text-muted-foreground"> / night</span>
                      </div>
                      <Button size="sm" className="bg-secondary text-white hover:bg-secondary/90">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
      <HomeFooter />
    </div>
  )
}

function HotelCountSkeleton() {
  return <span className="block h-10 w-36 animate-pulse rounded-md bg-muted" aria-hidden="true" />
}
