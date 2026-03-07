'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { CurrencyFilter, QuickType } from '@/components/home/types'

const featureProperties = [
  {
    id: 1,
    title: 'Family House Luxury',
    image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
    thumbnail: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
  },
  {
    id: 2,
    title: 'Modern Villa Estate',
    image: 'https://images.pexels.com/photos/7578983/pexels-photo-7578983.jpeg',
    thumbnail: 'https://images.pexels.com/photos/7578983/pexels-photo-7578983.jpeg',
  },
  {
    id: 3,
    title: 'Luxury Apartment',
    image: 'https://images.pexels.com/photos/7578892/pexels-photo-7578892.jpeg',
    thumbnail: 'https://images.pexels.com/photos/7578892/pexels-photo-7578892.jpeg',
  },
  {
    id: 4,
    title: 'Premium Penthouse',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=900&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=350&fit=crop',
  },
  {
    id: 5,
    title: 'Executive Home',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=900&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=350&fit=crop',
  },
]

type HomeHeroProps = {
  locationFilter: string
  typeFilter: string
  priceRangeFilter: string
  currencyFilter: CurrencyFilter
  quickType: QuickType
  onLocationChange: (value: string) => void
  onTypeChange: (value: string) => void
  onPriceRangeChange: (value: string) => void
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
}: HomeHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-rotate carousel
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
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentProperty.image}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
        {/* Large background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <span className="text-[15rem] font-bold text-white tracking-wider select-none">Home</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-between">
        {/* Top Section - Content */}
        <div className="flex-1 flex items-center px-6 sm:px-8 lg:px-16 xl:px-20">
          <div className="w-full max-w-2xl">
            {/* Heading and Description */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                Make Every Space Unique and Inspiring
              </h1>
              <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
                Your life evolves, and your home should too. We design flexible living spaces that adapt to your current needs and accommodate your evolving aspirations for the future.
              </p>
            </div>

            {/* Integrated Search Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-white/20 mt-8">
              <div className="space-y-4">
                {/* Location Search */}
                <input
                  type="text"
                  placeholder="Search location..."
                  value={locationFilter}
                  onChange={(e) => onLocationChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 text-white rounded-lg placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm backdrop-blur-sm transition-all"
                />

                {/* Filter Row */}
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={typeFilter}
                    onChange={(e) => onTypeChange(e.target.value)}
                    className="px-3 py-2.5 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 appearance-none cursor-pointer text-sm backdrop-blur-sm transition-all"
                  >
                    <option value="All Types" className="text-gray-900">Type</option>
                    <option value="House" className="text-gray-900">House</option>
                    <option value="Apartment" className="text-gray-900">Apartment</option>
                    <option value="Villa" className="text-gray-900">Villa</option>
                  </select>

                  <select
                    value={priceRangeFilter}
                    onChange={(e) => onPriceRangeChange(e.target.value)}
                    className="px-3 py-2.5 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 appearance-none cursor-pointer text-sm backdrop-blur-sm transition-all"
                  >
                    <option value="" className="text-gray-900">Price</option>
                    <option value="100000" className="text-gray-900">₦100K - ₦500K</option>
                    <option value="500000" className="text-gray-900">₦500K - ₦1M</option>
                    <option value="1000000" className="text-gray-900">₦1M+</option>
                  </select>
                </div>

                {/* Search Button */}
                <Button
                  onClick={onSearch}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg transition-all"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right - Property Showcase Card - Hidden on mobile */}
        <div className="hidden lg:block absolute bottom-12 right-6 sm:right-8 lg:right-16 xl:right-20 w-64 sm:w-72">
          <div className="relative">
            {/* Featured Property Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-gray-300">
                <img
                  src={currentProperty.thumbnail}
                  alt={currentProperty.title}
                  className="w-full h-full object-cover"
                />
                {/* Property Title Badge */}
                <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md rounded px-3 py-1">
                  <p className="text-white font-semibold text-xs">{currentProperty.title}</p>
                </div>
              </div>

              {/* Card Content */}
              <div className="px-4 py-4 space-y-4">
                {/* Pagination Section */}
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

                {/* Explore Button */}
                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-full text-sm transition-all duration-200">
                  Explore Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

