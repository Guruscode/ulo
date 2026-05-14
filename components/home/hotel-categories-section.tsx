'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePublicHotels } from '@/components/hotels/use-public-hotels'
import { formatHotelPrice } from '@/lib/hotels/presentation'
import { Star } from 'lucide-react'

export default function HotelCategoriesSection() {
  const { hotels, loading } = usePublicHotels()

  // Group hotels by location for categories
  const categories = [
    {
      title: 'Lagos Hotels',
      location: 'Lagos',
      description: 'Experience the vibrant energy of Nigeria\'s commercial capital',
      hotels: hotels.filter(hotel => hotel.location.toLowerCase().includes('lagos')).slice(0, 4)
    },
    {
      title: 'Abuja Hotels',
      location: 'Abuja',
      description: 'Discover the modern architecture and political heart of Nigeria',
      hotels: hotels.filter(hotel => hotel.location.toLowerCase().includes('abuja')).slice(0, 4)
    },
    {
      title: 'Port Harcourt Hotels',
      location: 'Port Harcourt',
      description: 'Enjoy the waterfront beauty and growing hospitality scene',
      hotels: hotels.filter(hotel => hotel.location.toLowerCase().includes('port harcourt')).slice(0, 4)
    },
    {
      title: 'Luxury Collection',
      location: 'luxury',
      description: 'Indulge in premium accommodations with exceptional service',
      hotels: hotels.filter(hotel => hotel.rating >= 4.5).slice(0, 4)
    }
  ].filter(category => category.hotels.length > 0)

  if (loading || categories.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
            Featured Hotels
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing stays across Nigeria's top destinations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-secondary mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>

                <div className="space-y-4">
                  {category.hotels.slice(0, 3).map((hotel) => (
                    <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                      <div className="group relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs font-medium text-gray-900">{hotel.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="text-sm font-semibold text-secondary truncate">{hotel.name}</h4>
                          <p className="text-xs text-muted-foreground">{formatHotelPrice(hotel.priceValue)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link href={`/hotels?location=${category.location}`}>
                  <button className="w-full bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                    View All
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}