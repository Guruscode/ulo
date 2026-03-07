'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import HomeFooter from '@/components/home/home-footer'
import HomeHero from '@/components/home/home-hero'
import HomeNav from '@/components/home/home-nav'
import HomeProperties from '@/components/home/home-properties'
import HeroServices from '@/components/home/hero-services'
import RecommendationsCta from '@/components/home/recommendations-cta'
import RecommendedProperties from '@/components/home/recommended-properties'
import NeighbourhoodGuide from '@/components/home/neighbourhood-guide'
import EstateSection from '@/components/home/estate-section'
import type { CurrencyFilter, Property, QuickType } from '@/components/home/types'
import { homeProperties } from '@/lib/home-properties'
import { homeEstates } from '@/lib/home-estates'

export default function Homepage() {
  const router = useRouter()
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [priceRangeFilter, setPriceRangeFilter] = useState('Any Price')
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilter>('Any')
  const [quickType, setQuickType] = useState<QuickType>('All')
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(homeProperties)

  const handleCurrencyChange = (value: CurrencyFilter) => {
    setCurrencyFilter(value)
    setPriceRangeFilter('Any Price')
  }

  const handleSearch = () => {
    // Build query params
    const params = new URLSearchParams()
    if (locationFilter.trim()) params.set('location', locationFilter.trim())
    if (typeFilter !== 'All Types') params.set('type', typeFilter)
    if (currencyFilter !== 'Any') params.set('currency', currencyFilter)
    if (priceRangeFilter !== 'Any Price') params.set('priceRange', priceRangeFilter)

    // Navigate to listings page with params
    router.push(`/listings?${params.toString()}`)
  }

  useEffect(() => {
    let result = [...homeProperties]

    let effectiveType = typeFilter
    if (quickType !== 'All') {
      if (quickType === 'Buy' || quickType === 'Sell') {
        effectiveType = 'For Sale'
      } else if (quickType === 'Rent') {
        effectiveType = 'For Rent'
      } else if (quickType === 'Shortlet') {
        effectiveType = 'Shortlet'
      }
    }

    if (locationFilter.trim()) {
      const term = locationFilter.toLowerCase().trim()
      result = result.filter(p => p.location.toLowerCase().includes(term))
    }

    if (effectiveType !== 'All Types') {
      result = result.filter(p => p.type === effectiveType)
    }

    if (currencyFilter !== 'Any') {
      result = result.filter(p => p.currency === currencyFilter)
    }

    if (priceRangeFilter !== 'Any Price' && currencyFilter !== 'Any') {
      const ranges = currencyFilter === 'USD' 
        ? { 'Under $500K': (v: number) => v < 500000, '$500K – $1M': (v: number) => v >= 500000 && v <= 1000000, '$1M – $2M': (v: number) => v > 1000000 && v <= 2000000, '$2M+': (v: number) => v > 2000000 }
        : { 'Under ₦500K': (v: number) => v < 500000, '₦500K – ₦1M': (v: number) => v >= 500000 && v <= 1000000, '₦1M – ₦2M': (v: number) => v > 1000000 && v <= 2000000, '₦2M+': (v: number) => v > 2000000 }
      const matcher = ranges[priceRangeFilter as keyof typeof ranges]
      if (matcher) {
        result = result.filter(p => matcher(p.priceValue))
      }
    }

    setFilteredProperties(result)
  }, [locationFilter, typeFilter, priceRangeFilter, currencyFilter, quickType])

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <HomeHero
        locationFilter={locationFilter}
        typeFilter={typeFilter}
        priceRangeFilter={priceRangeFilter}
        currencyFilter={currencyFilter}
        quickType={quickType}
        onLocationChange={setLocationFilter}
        onTypeChange={setTypeFilter}
        onPriceRangeChange={setPriceRangeFilter}
        onCurrencyChange={handleCurrencyChange}
        onQuickTypeChange={setQuickType}
        onSearch={handleSearch}
      />
      <RecommendationsCta />
      <HeroServices />
      <HomeProperties allProperties={homeProperties} filteredProperties={filteredProperties} />
      <RecommendedProperties properties={filteredProperties.length > 0 ? filteredProperties : homeProperties} />
      <NeighbourhoodGuide />
      <EstateSection estates={homeEstates} />
      <HomeFooter />
    </div>
  )
}

