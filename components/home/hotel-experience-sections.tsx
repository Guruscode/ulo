'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Sparkles, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HotelGridSkeleton } from '@/components/ui/page-skeletons'
import { formatHotelPrice } from '@/lib/hotels/presentation'
import type { HotelRecord } from '@/lib/hotels/types'

type HotelExperienceSectionsProps = {
  hotels: HotelRecord[]
  loading?: boolean
}

type DestinationSummary = {
  name: string
  image: string
  rating: number
  hotelsCount: number
  description: string
}

const destinationCopy: Record<string, string> = {
  lagos: 'Fast-moving city stays close to dining, business, and nightlife.',
  abuja: 'Calmer premium hotels with polished service and capital-city access.',
  'port harcourt': 'Waterfront business stays with spacious rooms and modern comfort.',
  ibadan: 'Relaxed city hotels with strong value and easy local access.',
}

export default function HotelExperienceSections({
  hotels,
  loading = false,
}: HotelExperienceSectionsProps) {
  const featuredHotels = hotels.filter((hotel) => hotel.featured)
  const hotelsToFeature = (featuredHotels.length > 0 ? featuredHotels : hotels).slice(0, 3)
  const heroHotel = hotelsToFeature[0]
  const secondaryHotels = hotelsToFeature.slice(1, 3)
  const curatedHotels = [...hotels]
    .sort((left, right) => right.rating - left.rating || left.priceValue - right.priceValue)
    .slice(0, 6)

  const destinations = Object.values(
    hotels.reduce<Record<string, DestinationSummary & { totalRating: number }>>((acc, hotel) => {
      const cityKey = hotel.location.split(',')[0]?.trim().toLowerCase() || 'other'

      if (!acc[cityKey]) {
        acc[cityKey] = {
          name: hotel.location.split(',')[0]?.trim() || hotel.location,
          image: hotel.image,
          rating: 0,
          hotelsCount: 0,
          totalRating: 0,
          description: destinationCopy[cityKey] || 'Well-positioned stays with polished hospitality options.',
        }
      }

      acc[cityKey].hotelsCount += 1
      acc[cityKey].totalRating += hotel.rating

      return acc
    }, {}),
  )
    .map((destination) => ({
      ...destination,
      rating: Number((destination.totalRating / destination.hotelsCount).toFixed(1)),
    }))
    .sort((left, right) => right.hotelsCount - left.hotelsCount)
    .slice(0, 3)

  if (loading) {
    return (
      <section className="bg-[#f4f1ea] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <HotelGridSkeleton count={3} />
        </div>
      </section>
    )
  }

  if (hotels.length === 0) {
    return (
      <section className="bg-[#f4f1ea] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Hotel highlights
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Discover amazing stays across Nigeria's top destinations
            </h2>
          </div>

          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center text-slate-600">
            No public hotels are available right now.
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="bg-[#f4f1ea] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                Hotel highlights
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Discover amazing stays across Nigeria's top destinations
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Start with high-signal stays, move through destination-led browsing, and then continue into the wider property catalog.
              </p>
            </div>

            <Link href="/hotels">
              <Button className="rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800">
                View all hotels
              </Button>
            </Link>
          </div>

          {heroHotel ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <Link href={`/hotels/${heroHotel.id}`}>
                <Card className="group overflow-hidden rounded-[2rem] border-0 bg-white shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
                  <div className="grid min-h-[420px] lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="relative min-h-[280px] overflow-hidden">
                      <img
                        src={heroHotel.image}
                        alt={heroHotel.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900">
                        <Sparkles className="h-3.5 w-3.5" />
                        Featured stay
                      </div>
                    </div>

                    <div className="flex flex-col justify-between p-6 sm:p-8">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="h-4 w-4" />
                          {heroHotel.location}
                        </div>
                        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                          {heroHotel.name}
                        </h3>
                        <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600 sm:text-base">
                          {heroHotel.description}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {heroHotel.amenities.slice(0, 4).map((amenity) => (
                            <span
                              key={amenity}
                              className="rounded-full bg-[#eef2f7] px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">From</p>
                          <p className="mt-2 text-2xl font-semibold text-slate-950">
                            {formatHotelPrice(heroHotel.priceValue)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {heroHotel.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>

              <div className="grid gap-6">
                {secondaryHotels.map((hotel) => (
                  <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                    <Card className="group overflow-hidden rounded-[1.8rem] border-0 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.10)]">
                      <div className="grid sm:grid-cols-[180px_1fr]">
                        <div className="relative h-56 overflow-hidden sm:h-full">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm text-slate-500">{hotel.location}</p>
                            <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              {hotel.rating}
                            </div>
                          </div>
                          <h3 className="mt-2 text-xl font-semibold text-slate-950">{hotel.name}</h3>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                            {hotel.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <p className="text-lg font-semibold text-slate-950">
                              {formatHotelPrice(hotel.priceValue)}
                            </p>
                            <span className="text-sm font-medium text-slate-600">
                              {hotel.rooms.length} rooms
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-[#0f1724] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/55">
                Destination edits
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Browse hotels through the cities users search first.
              </h2>
            </div>
            <Link href="/hotels">
              <Button variant="outline" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
                Explore hotels
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {destinations.map((destination) => (
              <Link
                key={destination.name}
                href={`/hotels?location=${encodeURIComponent(destination.name.toLowerCase())}`}
              >
                <Card className="group overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/5 text-white backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/[0.08]">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1724] via-[#0f1724]/20 to-transparent" />
                  </div>
                  <div className="space-y-3 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                        {destination.name}
                      </h3>
                      <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                        {destination.hotelsCount} hotels
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-white/70">{destination.description}</p>
                    <div className="flex items-center gap-2 text-sm text-white/75">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      Average rating {destination.rating}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Curated stays
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              More hotel options, still presented with restraint.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {curatedHotels.map((hotel) => (
              <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                <Card className="group overflow-hidden rounded-[1.8rem] border-0 bg-[#f8f8f6] shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute right-4 top-4 rounded-full bg-white/92 px-3 py-1 text-sm font-medium text-slate-900">
                      {formatHotelPrice(hotel.priceValue)}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-950">{hotel.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{hotel.location}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-amber-600">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {hotel.rating}
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                      {hotel.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                      <span className="text-sm text-slate-500">{hotel.rooms.length} rooms available</span>
                      <span className="inline-flex items-center text-sm font-medium text-slate-900">
                        View stay
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
