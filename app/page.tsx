'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import EstateSection from '@/components/home/estate-section'
import HeroServices from '@/components/home/hero-services'
import HomeFooter from '@/components/home/home-footer'
import HomeHero from '@/components/home/home-hero'
import HomeNav from '@/components/home/home-nav'
import HomeProperties from '@/components/home/home-properties'
import NeighbourhoodGuide from '@/components/home/neighbourhood-guide'
import type { CurrencyFilter, Property, QuickType } from '@/components/home/types'
import { usePublicHomeProperties } from '@/components/properties/use-public-home-properties'
import { homeEstates } from '@/lib/home-estates'

export default function Homepage() {
  const router = useRouter()
  const { properties } = usePublicHomeProperties()
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [priceRangeFilter, setPriceRangeFilter] = useState('Any Price')
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilter>('Any')
  const [quickType, setQuickType] = useState<QuickType>('All')
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])

  const handleCurrencyChange = (value: CurrencyFilter) => {
    setCurrencyFilter(value)
    setPriceRangeFilter('Any Price')
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (locationFilter.trim()) params.set('location', locationFilter.trim())
    if (typeFilter !== 'All Types') params.set('type', typeFilter)
    if (currencyFilter !== 'Any') params.set('currency', currencyFilter)
    if (priceRangeFilter !== 'Any Price') params.set('priceRange', priceRangeFilter)
    router.push(`/listings?${params.toString()}`)
  }

  useEffect(() => {
    let result = [...properties]

    let effectiveType = typeFilter
    if (quickType !== 'All') {
      if (quickType === 'Buy' || quickType === 'Sell') effectiveType = 'For Sale'
      if (quickType === 'Rent') effectiveType = 'For Rent'
      if (quickType === 'Shortlet') effectiveType = 'Shortlet'
    }

    if (locationFilter.trim()) {
      const term = locationFilter.toLowerCase().trim()
      result = result.filter((property) => property.location.toLowerCase().includes(term))
    }

    if (effectiveType !== 'All Types') {
      result = result.filter((property) => property.type === effectiveType)
    }

    if (currencyFilter !== 'Any') {
      result = result.filter((property) => property.currency === currencyFilter)
    }

    setFilteredProperties(result)
  }, [currencyFilter, locationFilter, priceRangeFilter, properties, quickType, typeFilter])

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
      <HeroServices />
      <HomeProperties allProperties={properties} filteredProperties={filteredProperties} />
      <NeighbourhoodGuide />
      <EstateSection estates={homeEstates} />
      <HomeFooter />
    </div>
  )
}
