'use client'

import Link from 'next/link'
import { Building2, MapPin, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePublicHotels } from '@/components/hotels/use-public-hotels'
import { formatHotelPrice } from '@/lib/hotels/presentation'

export default function HomeHotels() {
  const { hotels, loading } = usePublicHotels()
  const featuredHotels = hotels.filter((hotel) => hotel.featured).slice(0, 3)
  const hotelsToShow = featuredHotels.length > 0 ? featuredHotels : hotels.slice(0, 3)

  return (
    <section className="bg-slate-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-secondary/70">Hotels</p>
            <h2 className="mt-2 text-4xl font-serif font-bold text-secondary">Featured Stays</h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              Browse approved hotels with live room inventory and direct reservation requests.
            </p>
          </div>
          <Link href="/hotels">
            <Button className="bg-secondary text-white hover:bg-secondary/90">Explore Hotels</Button>
          </Link>
        </div>

        {loading ? (
          <Card className="mt-10 p-10 text-center text-muted-foreground">Loading approved hotels...</Card>
        ) : hotelsToShow.length === 0 ? (
          <Card className="mt-10 p-10 text-center text-muted-foreground">No approved hotels available yet.</Card>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {hotelsToShow.map((hotel) => (
              <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                <Card className="group overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-secondary">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {hotel.rating}
                    </div>
                  </div>
                  <div className="space-y-3 p-5">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{hotel.name}</h3>
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {hotel.location}
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{hotel.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">From</p>
                        <p className="text-xl font-bold text-secondary">{formatHotelPrice(hotel.priceValue)}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {hotel.rooms.length} rooms
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
