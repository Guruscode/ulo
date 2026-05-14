'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MapPin, Search, Star } from 'lucide-react'

import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import { usePublicHotels } from '@/components/hotels/use-public-hotels'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { HotelGridSkeleton } from '@/components/ui/page-skeletons'
import { formatHotelPrice } from '@/lib/hotels/presentation'

export default function HotelsPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '')
  const { hotels, loading } = usePublicHotels()

  const filteredHotels = useMemo(() => {
    return hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [hotels, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <section className="bg-gradient-to-b from-secondary/10 to-transparent pt-16 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">Hotels & Accommodation</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover approved hotels across Nigeria with live room inventory and reservation requests.</p>
          </div>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input placeholder="Search by location or hotel name..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="flex-1" />
            <Button className="bg-secondary hover:bg-secondary/90 text-white"><Search className="w-4 h-4" /></Button>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary">{loading ? <HotelCountSkeleton /> : `${filteredHotels.length} ${filteredHotels.length === 1 ? 'Hotel' : 'Hotels'}`}</h2>
        </div>
        {loading ? (
          <HotelGridSkeleton />
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-lg">{searchQuery ? 'No hotels found matching your search.' : 'No approved hotels available at the moment.'}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel) => (
              <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold">{hotel.rating}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-secondary mb-1 group-hover:text-secondary/80 transition-colors">{hotel.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3"><MapPin className="w-4 h-4" />{hotel.location}</div>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {hotel.amenities.slice(0, 4).map((amenity) => (
                        <span key={amenity} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">{amenity}</span>
                      ))}
                    </div>
                    <div className="flex items-baseline justify-between pt-3 border-t">
                      <div>
                        <span className="text-2xl font-bold text-secondary">{formatHotelPrice(hotel.priceValue)}</span>
                        <span className="text-sm text-muted-foreground"> / night</span>
                      </div>
                      <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-white">View Details</Button>
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
