'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import HomeFooter from '@/components/home/home-footer'
import HomeHero from '@/components/home/home-hero'
import HotelExperienceSections from '@/components/home/hotel-experience-sections'
import ListedPropertiesSection from '@/components/home/listed-properties-section'
import HomeNav from '@/components/home/home-nav'
import type { CurrencyFilter, QuickType } from '@/components/home/types'
import { usePublicHotels } from '@/components/hotels/use-public-hotels'
import { usePublicHomeProperties } from '@/components/properties/use-public-home-properties'

export default function Homepage() {
  const router = useRouter()
  const { properties, loading } = usePublicHomeProperties()
  const { hotels, loading: hotelsLoading } = usePublicHotels()
  const [locationFilter, setLocationFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [priceRangeFilter, setPriceRangeFilter] = useState('')
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilter>('Any')
  const [quickType, setQuickType] = useState<QuickType>('All')
  const [customMinPrice, setCustomMinPrice] = useState<number>(0)
  const [customMaxPrice, setCustomMaxPrice] = useState<number>(0)

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
    router.push(params.toString() ? `/hotels?${params.toString()}` : '/hotels')
  }

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
      
      <HotelExperienceSections hotels={hotels} loading={hotelsLoading} />
      <ListedPropertiesSection properties={properties} loading={loading} />
      <HomeFooter />
    </div>
  )
}
