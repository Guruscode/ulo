'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Bath, BedDouble, ChevronDown, Heart, MapPin, Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { PropertyGridSkeleton } from '@/components/ui/page-skeletons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { usePublicHomeProperties } from '@/components/properties/use-public-home-properties'
import { cn } from '@/lib/utils'

const BEDROOM_OPTIONS = ['any', '1+', '2+', '3+', '4+', '5+'] as const
const BATHROOM_OPTIONS = ['any', '1+', '1.5+', '2+', '3+', '4+'] as const
type RangeOption = (typeof BEDROOM_OPTIONS)[number] | (typeof BATHROOM_OPTIONS)[number]

function parseMinimumValue(value: RangeOption) {
  if (value === 'any') {
    return null
  }

  return Number(value.replace('+', ''))
}

function matchesCountFilter(value: number, filter: RangeOption, exactMatch: boolean) {
  const minimumValue = parseMinimumValue(filter)

  if (minimumValue === null) {
    return true
  }

  return exactMatch ? value === minimumValue : value >= minimumValue
}

export default function ListingsContent() {
  const searchParams = useSearchParams()
  const { properties, loading } = usePublicHomeProperties()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all')
  const [priceMin, setPriceMin] = useState<number | ''>('')
  const [priceMax, setPriceMax] = useState<number | ''>('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isBedsBathsOpen, setIsBedsBathsOpen] = useState(false)
  const [selectedBedrooms, setSelectedBedrooms] = useState<RangeOption>('any')
  const [selectedBathrooms, setSelectedBathrooms] = useState<RangeOption>('any')
  const [draftBedrooms, setDraftBedrooms] = useState<RangeOption>('any')
  const [draftBathrooms, setDraftBathrooms] = useState<RangeOption>('any')
  const [useExactMatch, setUseExactMatch] = useState(false)
  const [draftUseExactMatch, setDraftUseExactMatch] = useState(false)

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
      const matchesBedrooms = matchesCountFilter(property.bedrooms, selectedBedrooms, useExactMatch)
      const matchesBathrooms = matchesCountFilter(property.bathrooms, selectedBathrooms, useExactMatch)

      return matchesSearch && matchesPriceMin && matchesPriceMax && matchesType && matchesBedrooms && matchesBathrooms
    })
  }, [priceMax, priceMin, properties, searchTerm, selectedBathrooms, selectedBedrooms, selectedType, useExactMatch])

  const displayedTypes = ['all', ...Array.from(new Set(properties.map((property) => property.type)))]
  const activeBedsBathsCount = Number(selectedBedrooms !== 'any') + Number(selectedBathrooms !== 'any')
  const hasActiveFilters =
    searchTerm ||
    selectedType !== 'all' ||
    priceMin !== '' ||
    priceMax !== '' ||
    selectedBedrooms !== 'any' ||
    selectedBathrooms !== 'any'

  const openBedsBathsFilter = (open: boolean) => {
    setIsBedsBathsOpen(open)

    if (open) {
      setDraftBedrooms(selectedBedrooms)
      setDraftBathrooms(selectedBathrooms)
      setDraftUseExactMatch(useExactMatch)
    }
  }

  const applyBedsBathsFilter = () => {
    setSelectedBedrooms(draftBedrooms)
    setSelectedBathrooms(draftBathrooms)
    setUseExactMatch(draftUseExactMatch)
    setIsBedsBathsOpen(false)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setPriceMin('')
    setPriceMax('')
    setSelectedBedrooms('any')
    setSelectedBathrooms('any')
    setDraftBedrooms('any')
    setDraftBathrooms('any')
    setUseExactMatch(false)
    setDraftUseExactMatch(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[#f9f6f3] ">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 mt-32">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Find Your Property</h1>
            <p className="text-gray-600 text-lg mt-1">
              {loading ? <ResultsCountSkeleton /> : `${filteredProperties.length} properties found`}
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
              <Popover open={isBedsBathsOpen} onOpenChange={openBedsBathsFilter}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-11 justify-between gap-3 px-4 text-sm font-medium">
                    <span className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-slate-500" />
                      Beds & Baths
                      {activeBedsBathsCount > 0 ? (
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                          {activeBedsBathsCount}
                        </span>
                      ) : null}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[340px] space-y-6 rounded-2xl border border-slate-200 p-0 shadow-xl">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <p className="text-lg font-semibold text-slate-900">Number of Bedrooms</p>
                  </div>

                  <div className="space-y-5 px-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <BedDouble className="h-4 w-4 text-slate-500" />
                        Bedrooms
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {BEDROOM_OPTIONS.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setDraftBedrooms(option)}
                            className={cn(
                              'rounded-xl border px-3 py-3 text-sm font-medium transition-colors',
                              draftBedrooms === option
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                            )}
                          >
                            {option === 'any' ? 'Any' : option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-700">
                      <Checkbox checked={draftUseExactMatch} onCheckedChange={(checked) => setDraftUseExactMatch(checked === true)} />
                      <span>Use exact match</span>
                    </label>
                  </div>

                  <div className="border-t border-slate-100 px-5 pt-5">
                    <p className="text-lg font-semibold text-slate-900">Number of Bathrooms</p>
                  </div>

                  <div className="space-y-3 px-5 pb-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Bath className="h-4 w-4 text-slate-500" />
                      Bathrooms
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {BATHROOM_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setDraftBathrooms(option)}
                          className={cn(
                            'rounded-xl border px-3 py-3 text-sm font-medium transition-colors',
                            draftBathrooms === option
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                          )}
                        >
                          {option === 'any' ? 'Any' : option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setDraftBedrooms('any')
                        setDraftBathrooms('any')
                        setDraftUseExactMatch(false)
                      }}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      Clear
                    </Button>
                    <Button type="button" onClick={applyBedsBathsFilter} className="min-w-32 bg-sky-600 text-white hover:bg-sky-700">
                      Apply
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
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
          <PropertyGridSkeleton />
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No properties found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search term, price range, beds and baths, or property type.</p>
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
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-sm">
                        {property.type !== 'Land' ? <div><p className="text-gray-500 text-xs">Beds</p><p className="font-medium text-gray-900">{property.bedrooms}</p></div> : null}
                        {property.type !== 'Land' ? <div><p className="text-gray-500 text-xs">Baths</p><p className="font-medium text-gray-900">{property.bathrooms}</p></div> : null}
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

function ResultsCountSkeleton() {
  return <span className="block h-7 w-48 animate-pulse rounded-md bg-muted" aria-hidden="true" />
}
