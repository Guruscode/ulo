'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

import { usePublicHomeProperties } from '@/components/properties/use-public-home-properties'
import { Button } from '@/components/ui/button'

export default function RecommendationsCta() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { properties } = usePublicHomeProperties()
  const itemsPerSlide = 2
  const recommended = properties.slice(0, 6)

  if (recommended.length === 0) return null

  const maxIndex = Math.ceil(recommended.length / itemsPerSlide) - 1
  const visibleProperties = recommended.slice(currentIndex * itemsPerSlide, (currentIndex + 1) * itemsPerSlide)

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
          <div className="space-y-4">
            <p className="text-2xl md:text-3xl font-semibold text-gray-900">Get home recommendations</p>
            <p className="text-gray-600 text-lg">Sign in for a more personalized experience.</p>
            <Link href="/login"><Button className="rounded-full bg-gray-900 text-white hover:bg-gray-800 px-8">Sign in</Button></Link>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div className="grid grid-cols-1 gap-1">
                {visibleProperties.map((property) => (
                  <Link key={property.id} href={`/properties/${property.id}`}>
                    <div className="group cursor-pointer">
                      <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${property.image})` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <p className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">{property.price}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-gray-700">{property.title}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="line-clamp-1">{property.location}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {maxIndex > 0 ? (
              <div className="flex items-center justify-end gap-2 mt-4">
                <button onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all" aria-label="Previous">
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <span className="text-sm text-gray-500 min-w-fit px-2">{currentIndex + 1} / {maxIndex + 1}</span>
                <button onClick={() => setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0))} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all" aria-label="Next">
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
