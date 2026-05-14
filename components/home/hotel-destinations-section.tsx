'use client'

import { motion } from 'framer-motion'
import { MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import { usePublicHotels } from '@/components/hotels/use-public-hotels'

export default function HotelDestinationsSection() {
  const { hotels, loading } = usePublicHotels()

  // Group hotels by location and calculate stats
  const locationStats = hotels.reduce((acc, hotel) => {
    const location = hotel.location.toLowerCase().split(',')[0].trim() // Get city name
    if (!acc[location]) {
      acc[location] = {
        name: hotel.location.split(',')[0].trim(),
        hotels: [],
        totalRating: 0,
        count: 0
      }
    }
    acc[location].hotels.push(hotel)
    acc[location].totalRating += hotel.rating
    acc[location].count += 1
    return acc
  }, {} as Record<string, { name: string; hotels: any[]; totalRating: number; count: number }>)

  const destinations = Object.values(locationStats)
    .map(stat => ({
      name: stat.name,
      hotels: stat.count,
      rating: stat.count > 0 ? Number((stat.totalRating / stat.count).toFixed(1)) : 0,
      description: getLocationDescription(stat.name),
      image: stat.hotels[0]?.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop'
    }))
    .sort((a, b) => b.hotels - a.hotels)
    .slice(0, 6)

  if (loading || destinations.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
            Popular Destinations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing hotels in Nigeria's most exciting cities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/hotels?location=${destination.name.toLowerCase()}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md rounded-full px-3 py-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-sm font-medium">{destination.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-semibold text-secondary">{destination.name}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{destination.hotels} hotels</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{destination.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/hotels">
            <button className="bg-secondary hover:bg-secondary/90 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105">
              Explore All Destinations
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function getLocationDescription(location: string): string {
  const descriptions: Record<string, string> = {
    'Lagos': 'Nigeria\'s vibrant commercial capital with world-class hotels and nightlife.',
    'Abuja': 'The federal capital featuring modern architecture and government buildings.',
    'Port Harcourt': 'Oil-rich city with beautiful waterfront and growing hospitality scene.',
    'Kano': 'Historic northern city with rich cultural heritage and traditional markets.',
    'Ibadan': 'Cultural capital of Yorubaland with universities and vibrant arts scene.',
    'Enugu': 'Coal city with beautiful landscapes and growing tourism industry.',
    'Kaduna': 'Northern city known for its hospitality and cultural diversity.',
    'Ogun': 'Gateway state with proximity to Lagos and industrial growth.',
    'Oyo': 'Historic city with rich Yoruba heritage and educational institutions.',
    'Rivers': 'State capital with modern infrastructure and business opportunities.',
    'Delta': 'Oil-rich state with beautiful landscapes and hospitality industry.',
    'Edo': 'Home to Benin City with rich history and cultural attractions.',
    'Ondo': 'State with beautiful landscapes and growing tourism sector.',
    'Osun': 'Known for its cultural festivals and historical sites.',
    'Ekiti': 'State with beautiful hills and growing hospitality industry.',
    'Kwara': 'Known for its hospitality and proximity to Abuja.',
    'Niger': 'State with natural attractions and growing tourism.',
    'Kogi': 'Central state with diverse cultural heritage.',
    'Benue': 'Known for its agricultural richness and hospitality.',
    'Plateau': 'Home to Jos with cool climate and tourist attractions.',
    'Nasarawa': 'State with natural beauty and proximity to Abuja.',
    'FCT': 'Federal Capital Territory with modern amenities.',
    'Adamawa': 'State with natural attractions and cultural diversity.',
    'Taraba': 'Known for its wildlife and natural beauty.',
    'Bauchi': 'State with rich cultural heritage and hospitality.',
    'Gombe': 'Growing state with developing hospitality industry.',
    'Yobe': 'Northern state with unique cultural attractions.',
    'Borno': 'Historic state with rich cultural heritage.',
    'Jigawa': 'Agricultural state with growing hospitality sector.',
    'Sokoto': 'Northern state with traditional hospitality.',
    'Zamfara': 'State with cultural richness and hospitality.',
    'Kebbi': 'Known for its agricultural products and hospitality.',
    'Katsina': 'Northern state with cultural diversity.',
    'Anambra': 'Southeastern state with vibrant culture and hospitality.',
    'Imo': 'State known for its oil palm and hospitality industry.',
    'Abia': 'Commercial state with growing hospitality sector.',
    'Ebonyi': 'State with natural attractions and hospitality.',
    'Akwa Ibom': 'State with beautiful beaches and hospitality.',
    'Cross River': 'Known for its natural beauty and tourism.',
    'Bayelsa': 'Oil-rich state with waterfront attractions.',
    'default': 'A beautiful destination with excellent hospitality options.'
  }

  return descriptions[location] || descriptions['default']
}