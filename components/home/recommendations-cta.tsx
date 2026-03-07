'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { homeProperties } from '@/lib/home-properties'
import type { Property } from '@/components/home/types'

export default function RecommendationsCta() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerSlide = 2
  // Get up to 6 properties for carousel
  const recommended = homeProperties.slice(0, 6)
  
  if (recommended.length === 0) return null

  const maxIndex = Math.ceil(recommended.length / itemsPerSlide) - 1

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
  }

  const visibleProperties = recommended.slice(currentIndex * itemsPerSlide, (currentIndex + 1) * itemsPerSlide)

  const formatPrice = (price: string) => {
    // Keep original format
    return price
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
          {/* Left side - CTA */}
          <div className="space-y-4">
            <p className="text-2xl md:text-3xl font-semibold text-gray-900">
              Get home recommendations
            </p>
            <p className="text-gray-600 text-lg">
              Sign in for a more personalized experience.
            </p>
            <Link href="/login">
              <Button className="rounded-full bg-gray-900 text-white hover:bg-gray-800 px-8">
                Sign in
              </Button>
            </Link>
          </div>

          {/* Right side - Property Carousel */}
          <div className="relative">
            {/* Carousel */}
            <div className="overflow-hidden rounded-2xl">
              <div className="grid grid-cols-2 gap-4">
                {visibleProperties.map((property) => (
                  <Link key={property.id} href={`/properties/${property.id}`}>
                    <div className="group cursor-pointer">
                      {/* Image */}
                      <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                          style={{ backgroundImage: `url(${property.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Price badge */}
                        <div className="absolute bottom-3 left-3">
                          <p className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                            {formatPrice(property.price)}
                          </p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-gray-700">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="line-clamp-1">{property.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                          <span>{property.bedrooms} bd</span>
                          <span>•</span>
                          <span>{property.bathrooms} ba</span>
                          <span>•</span>
                          <span>{property.sqft}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            {maxIndex > 0 && (
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <span className="text-sm text-gray-500 min-w-fit px-2">
                  {currentIndex + 1} / {maxIndex + 1}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

