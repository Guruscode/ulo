'use client'

import React from "react"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Building2, Eye, Flame, Heart, MapPin, Sparkles, Star } from 'lucide-react'
import type { Property } from '@/components/home/types'

type PropertyCardProps = {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter()
  const isOnSale = property.badges?.includes('on-sale')
  const isHot = property.badges?.includes('hot')
  const isTrending = property.badges?.includes('trending')
  const isPopular = property.badges?.includes('popular')
  const isRecommended = property.badges?.includes('recommended')
  const isNew = property.badges?.includes('new')

  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    router.push('/login')
  }

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group h-full flex flex-col relative border">
        <div
          className="relative h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${property.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/75 transition-all duration-300" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isOnSale && (
              <div className="relative inline-block">
                <span className="px-3.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                  {property.discount || 'ON SALE'}
                </span>
                <div className="absolute inset-0 rounded-full bg-red-500/40 blur-md animate-pulse" />
              </div>
            )}

            {isNew && (
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-md">
                NEW
              </span>
            )}

            {isHot && (
              <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                <Flame size={14} /> HOT
              </span>
            )}

            {isTrending && (
              <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                <Sparkles size={14} /> TRENDING
              </span>
            )}

            {isPopular && (
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md">
                POPULAR
              </span>
            )}

            {isRecommended && (
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                <Star size={14} className="fill-white" /> RECOMMENDED
              </span>
            )}
          </div>

          <button
            onClick={handleHeartClick}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10 cursor-pointer"
          >
            <Heart className="w-5 h-5 text-gray-700" />
          </button>

          {property.views && (
            <div className="absolute bottom-3 right-3 text-xs text-white bg-black/50 px-2.5 py-1 rounded-full flex items-center gap-1.5 z-10">
              <Eye size={14} />
              {property.views.toLocaleString()}
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow space-y-4">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin size={14} />
              {property.location}
            </p>
            <h3 className="font-semibold text-lg mt-1 line-clamp-2 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
          </div>

          <div className="mt-auto space-y-4">
            <p className="text-2xl font-serif font-bold text-primary">
              {property.price}
              {property.originalPrice && (
                <span className="ml-2.5 text-base text-muted-foreground line-through">
                  {property.originalPrice}
                </span>
              )}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <Building2 size={16} />
                  {property.bedrooms} Beds
                </div>
              )}
              {property.bathrooms > 0 && (
                <div>{property.bathrooms} Baths</div>
              )}
              <div>{property.sqft} sqft</div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
              <span className="text-muted-foreground">
                Listed by {property.listedBy}
              </span>
              <span className="text-primary font-medium hover:underline cursor-pointer">
                {property.listedBy === 'Landlord' ? 'Register to Contact' : 'View Contact'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
