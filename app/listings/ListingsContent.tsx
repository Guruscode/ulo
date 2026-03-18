'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin, Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { usePublicHomeProperties } from '@/components/properties/use-public-home-properties'

export default function ListingsContent() {
  const searchParams = useSearchParams()
  const { properties, loading } = usePublicHomeProperties()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all')
  const [priceMin, setPriceMin] = useState<number | ''>('')
  const [priceMax, setPriceMax] = useState<number | ''>('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        property.title.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower) ||
        (property.estate && property.estate.toLowerCase().includes(searchLower))

      const matchesPriceMin = priceMin === '' || property.priceValue >= priceMin
      const matchesPriceMax = priceMax === '' || property.priceValue <= priceMax
      const matchesType = selectedType === 'all' || property.type === selectedType

      return matchesSearch && matchesPriceMin && matchesPriceMax && matchesType
    })
  }, [priceMax, priceMin, properties, searchTerm, selectedType])

  const displayedTypes = ['all', ...Array.from(new Set(properties.map((property) => property.type)))]
  const hasActiveFilters = searchTerm || selectedType !== 'all' || priceMin !== '' || priceMax !== ''

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setPriceMin('')
    setPriceMax('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[#f9f6f3] ">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 mt-32">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Find Your Property</h1>
            <p className="text-gray-600 text-lg mt-1">
              {loading ? 'Loading approved properties...' : `${filteredProperties.length} properties found`}
            </p>
          </div>
          {hasActiveFilters ? (
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-900 underline">
                Clear all
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by location, title or estate..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Button variant="outline" onClick={() => setIsFilterOpen(!isFilterOpen)} className="lg:hidden">
              <Search className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <div className={`flex flex-col lg:flex-row gap-4 ${isFilterOpen || 'hidden lg:flex'}`}>
              <div className="flex flex-wrap gap-2">
                {displayedTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedType === type ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'All' : type}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min" value={priceMin} onChange={(event) => setPriceMin(event.target.value === '' ? '' : Number(event.target.value))} className="w-28 h-10" />
                <span className="text-gray-400">-</span>
                <Input type="number" placeholder="Max" value={priceMax} onChange={(event) => setPriceMax(event.target.value === '' ? '' : Number(event.target.value))} className="w-28 h-10" />
              </div>
              {hasActiveFilters ? (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-900">
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-600">Loading approved properties...</div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No properties found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search term, price range or property type.</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {filteredProperties.map((property, index) => (
              <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                <Link href={`/properties/${property.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer border border-gray-200">
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${property.image})` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-75 transition-opacity" />
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10" onClick={(event) => event.preventDefault()}>
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                      </button>
                      <div className="absolute bottom-3 left-3">
                        <p className="bg-gray-900/90 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">{property.price}</p>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{property.type}</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-gray-700 transition-colors">{property.title}</h3>
                      <div className="flex items-center gap-1.5 text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm line-clamp-1">{property.location}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-sm">
                        <div><p className="text-gray-500 text-xs">Beds</p><p className="font-medium text-gray-900">{property.bedrooms}</p></div>
                        <div><p className="text-gray-500 text-xs">Baths</p><p className="font-medium text-gray-900">{property.bathrooms}</p></div>
                        <div><p className="text-gray-500 text-xs">Sqft</p><p className="font-medium text-gray-900">{property.sqft}</p></div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}
