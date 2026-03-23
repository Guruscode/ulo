'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import EstateSection from '@/components/home/estate-section'
import HeroServices from '@/components/home/hero-services'
import HomeFooter from '@/components/home/home-footer'
import HomeHero from '@/components/home/home-hero'
import HomeHotels from '@/components/home/home-hotels'
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
  const [priceRangeFilter, setPriceRangeFilter] = useState('')
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilter>('Any')
  const [quickType, setQuickType] = useState<QuickType>('All')
  const [customMinPrice, setCustomMinPrice] = useState<number>(0)
  const [customMaxPrice, setCustomMaxPrice] = useState<number>(0)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])

  const handleCurrencyChange = (value: CurrencyFilter) => {
    setCurrencyFilter(value)
    setPriceRangeFilter('')
    setCustomMinPrice(0)
    setCustomMaxPrice(0)
  }

  const handleCustomMinPriceChange = (value: number) => {
    setCustomMinPrice(value)
  }

  const handleCustomMaxPriceChange = (value: number) => {
    setCustomMaxPrice(value)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (locationFilter.trim()) params.set('location', locationFilter.trim())
    if (typeFilter !== 'All Types') params.set('type', typeFilter)
    if (currencyFilter !== 'Any') params.set('currency', currencyFilter)
    if (priceRangeFilter && priceRangeFilter !== '') params.set('priceRange', priceRangeFilter)
    if (customMinPrice > 0) params.set('customMin', customMinPrice.toString())
    if (customMaxPrice > 0) params.set('customMax', customMaxPrice.toString())
    router.push(`/listings?${params.toString() || '#'}`)
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

    // Price filtering
    if (priceRangeFilter === 'custom' && (customMinPrice > 0 || customMaxPrice > 0)) {
      result = result.filter((property) => {
        const priceNum = property.priceValue
        return priceNum >= customMinPrice && (customMaxPrice === 0 || priceNum <= customMaxPrice)
      })
    } else if (priceRangeFilter) {
      const minPrice = parseInt(priceRangeFilter)
      result = result.filter((property) => property.priceValue >= minPrice)
    }

    setFilteredProperties(result)
  }, [currencyFilter, locationFilter, priceRangeFilter, customMinPrice, customMaxPrice, properties, quickType, typeFilter])

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <HomeHero
        locationFilter={locationFilter}
        typeFilter={typeFilter}
        priceRangeFilter={priceRangeFilter}
        currencyFilter={currencyFilter}
        quickType={quickType}
        customMinPrice={customMinPrice}
        customMaxPrice={customMaxPrice}
        onLocationChange={setLocationFilter}
        onTypeChange={setTypeFilter}
        onPriceRangeChange={setPriceRangeFilter}
        onCustomMinPriceChange={handleCustomMinPriceChange}
        onCustomMaxPriceChange={handleCustomMaxPriceChange}
        onCurrencyChange={handleCurrencyChange}
        onQuickTypeChange={setQuickType}
        onSearch={handleSearch}
      />
      <HeroServices />
      <HomeProperties allProperties={properties} filteredProperties={filteredProperties} />
      <HomeHotels />
      <NeighbourhoodGuide />
      {/* <EstateSection estates={homeEstates} /> */}
      <HomeFooter />
    </div>
  )
}
