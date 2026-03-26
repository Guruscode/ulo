'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { CurrencyFilter, QuickType } from '@/components/home/types'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const featureProperties = [
  {
    id: 1,
    title: 'Luxury five star Hotel',
    image: 'https://image2url.com/r2/default/images/1773914209038-0ea9de80-d4a1-42b1-96bf-6a5b8161f677.jpg',
    thumbnail: 'https://image2url.com/r2/default/images/1773914209038-0ea9de80-d4a1-42b1-96bf-6a5b8161f677.jpg',
  },
  {
    id: 2,
    title: 'Luxury city Apartment',
    image: 'https://image2url.com/r2/default/images/1773914288792-6bad1841-26ba-494b-8a3b-d7c62630fad6.jpg',
    thumbnail: 'https://image2url.com/r2/default/images/1773914288792-6bad1841-26ba-494b-8a3b-d7c62630fad6.jpg',
  },
  {
    id: 3,
    title: 'Modern Cozy hotel amenity',
    image: 'https://image2url.com/r2/default/images/1773914396351-4ebaafbd-d8ad-4006-aa20-3fbeb0d83d97.jpg',
    thumbnail: 'https://image2url.com/r2/default/images/1773914396351-4ebaafbd-d8ad-4006-aa20-3fbeb0d83d97.jpg',
  },
  {
    id: 4,
    title: 'Premium Penthouse Suite',
    image: 'https://image2url.com/r2/default/images/1773914912960-1730ed36-17b1-4c7a-af1e-85aae2a11c97.jpg',
    thumbnail: 'https://image2url.com/r2/default/images/1773914912960-1730ed36-17b1-4c7a-af1e-85aae2a11c97.jpg',
  },
  {
    id: 5,
    title: 'Land',
    image: 'https://images.pexels.com/photos/5474825/pexels-photo-5474825.jpeg',
    thumbnail: 'https://images.pexels.com/photos/5474825/pexels-photo-5474825.jpeg',
  },
]

type HomeHeroProps = {
  locationFilter: string
  typeFilter: string
  priceRangeFilter: string
  currencyFilter: CurrencyFilter
  quickType: QuickType
  customMinPrice: number
  customMaxPrice: number
  onLocationChange: (value: string) => void
  onTypeChange: (value: string) => void
  onPriceRangeChange: (value: string) => void
  onCustomMinPriceChange: (value: number) => void
  onCustomMaxPriceChange: (value: number) => void
  onCurrencyChange: (value: CurrencyFilter) => void
  onQuickTypeChange: (value: QuickType) => void
  onSearch: () => void
}

export default function HomeHero({
  locationFilter,
  typeFilter,
  priceRangeFilter,
  currencyFilter,
  quickType,
  onLocationChange,
  onTypeChange,
  onPriceRangeChange,
  onCurrencyChange,

  onQuickTypeChange,
  onSearch,
  customMinPrice,
  customMaxPrice,
  onCustomMinPriceChange,
  onCustomMaxPriceChange,
}: HomeHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureProperties.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featureProperties.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featureProperties.length) % featureProperties.length)
  }

  const currentProperty = featureProperties[currentSlide]

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={currentProperty.image}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <span className="text-[15rem] font-bold text-white tracking-wider select-none">ULO</span>
        </div>
      </div>

      <div className="relative h-full flex flex-col justify-between">
        <div className="flex-1 flex items-center px-6 sm:px-8 lg:px-16 xl:px-20">
          <div className="w-full max-w-2xl">
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                Find Your Perfect Space — Faster, Smarter, Better
              </h1>
              <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
                Buy, rent, or book verified properties, apartments, and hotels across Nigeria — all in one seamless platform designed for modern living and smart decisions.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-white/20 mt-8">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search by city, area, or property name..."
                  value={locationFilter}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 text-white rounded-lg placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm backdrop-blur-sm transition-all"
                />

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={typeFilter}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="px-3 py-2.5 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 appearance-none cursor-pointer text-sm backdrop-blur-sm transition-all"
                  >
                    <option value="All Types" className="text-gray-900">Property Type</option>
                    <option value="House" className="text-gray-900">House</option>
                    <option value="Apartment" className="text-gray-900">Apartment</option>
                    <option value="Villa" className="text-gray-900">Villa</option>
                    <option value="Shortlet" className="text-gray-900">Shortlet</option>
                    <option value="Land" className="text-gray-900">Land</option>
                  </select>

                  <div className="flex gap-2">
                    <div className="relative">
                      <select
                        value={priceRangeFilter}
                        onChange={(e) => onPriceRangeChange(e.target.value)}
                        className="flex-1 px-3 py-2.5 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 appearance-none cursor-pointer text-sm backdrop-blur-sm transition-all"
                      >
                        <option value="" className="text-gray-900">Budget Range</option>
                        <option value="100000" className="text-gray-900">₦100K - ₦500K</option>
                        <option value="500000" className="text-gray-900">₦500K - ₦1M</option>
                        <option value="1000000" className="text-gray-900">₦1M - ₦5M</option>
                        <option value="5000000" className="text-gray-900">₦5M+</option>
                        <option value="custom" className="text-gray-900">Custom Range</option>
                      </select>
                      {priceRangeFilter === 'custom' && (
                        <Dialog open={priceRangeFilter === 'custom'}>
                          <DialogTrigger asChild>
                            <Button 
                              type="button" 
                              variant="secondary" 
                              className="absolute inset-0 text-white/80 text-xs bg-transparent border-white/30 hover:bg-white/10 rounded-lg"
                              size="sm"
                            >
                              Set Custom Range
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Custom Price Range</DialogTitle>
                              <DialogDescription>
                                Set your preferred minimum and maximum price range.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                            <label className="text-sm font-medium text-black/90 block mb-2">Minimum Price</label>
                                <input
                                  type="number"
                                  placeholder="Min ₦"
                                  value={customMinPrice ?? ''}
                                  onChange={(e) => onCustomMinPriceChange(Number(e.target.value) || 0)}
                                  className="w-full px-3 py-2 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black/40 text-black placeholder:text-white/60 bg-black/10 backdrop-blur-sm text-sm"
                                />

                              </div>
                              <div>
                                <label className="text-sm font-medium text-black/90 block mb-2">Maximum Price</label>
                                  <input
                                    type="number"
                                    placeholder="Max ₦"
                                    value={customMaxPrice ?? ''}
                                    onChange={(e) => onCustomMaxPriceChange(Number(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black/40 text-black placeholder:text-white/60 bg-black/10 backdrop-blur-sm text-sm"
                                  />

                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={onSearch}>Apply & Search</Button>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                    </div>


                  </div>
                </div>

                <Button
                  onClick={onSearch}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg transition-all"
                >
                  Search Properties
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-12 right-6 sm:right-8 lg:right-16 xl:right-20 w-64 sm:w-72">
          <div className="relative">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-48 overflow-hidden bg-gray-300">
                <img
                  src={currentProperty.thumbnail}
                  alt={currentProperty.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md rounded px-3 py-1">
                  <p className="text-white font-semibold text-xs">{currentProperty.title}</p>
                </div>
              </div>

              <div className="px-4 py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevSlide}
                    className="text-gray-700 hover:text-gray-900 font-semibold text-xs transition-colors duration-200"
                  >
                    PREV
                  </button>

                  <div className="text-gray-900 font-bold text-xs tracking-wide">
                    {String(currentSlide + 1).padStart(2, '0')}/{String(featureProperties.length).padStart(2, '0')}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="text-gray-700 hover:text-gray-900 font-semibold text-xs transition-colors duration-200"
                  >
                    NEXT
                  </button>
                </div>

                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-full text-sm transition-all duration-200">
                  Explore Property
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
