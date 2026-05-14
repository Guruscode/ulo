'use client'

import { MapPin, Search } from 'lucide-react'
import { motion } from 'framer-motion'

import type { CurrencyFilter, QuickType } from '@/components/home/types'
import { Button } from '@/components/ui/button'

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
  onLocationChange,
  onSearch,
}: HomeHeroProps) {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#0c1825]">
      <div className="absolute inset-0">
        <img
          // src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80"
              src="./background.png"
          alt="Modern luxury stay"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,32,0.82)_0%,rgba(11,25,44,0.54)_44%,rgba(9,18,28,0.28)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,20,0.22)_0%,rgba(5,10,20,0.08)_35%,rgba(5,10,20,0.45)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-4 pb-8 pt-28 sm:px-6 sm:pb-10 lg:px-10 lg:pt-32">
        <div className="flex flex-1 items-center">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center xl:grid-cols-[minmax(0,1fr)_540px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/12 px-3 py-2 text-sm text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-white" />
                Find trusted stays in Nigeria
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-900">
                  Verified
                </span>
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-[6.5rem]">
                Are you looking for a place to stay?
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white sm:text-lg">
                Search for hotels and properties across Nigeria's top destinations, all verified for quality and trustworthiness.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: 'easeOut' }}
              className="lg:justify-self-end"
            >
              <div className="rounded-[2.2rem] border border-white/15 bg-black/12 p-5 text-white backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6 w-full max-w-6xl">
                <div className="rounded-[1.9rem] border border-white/12 bg-white/10 p-6 sm:p-7">
                  {/* <p className="text-right text-[clamp(2rem,4vw,4rem)] font-light leading-none tracking-[-0.05em] text-white/86">
                    Where do
                    <br />
                    you want
                    <br />
                    to stay?
                  </p> */}

                  <div className="mt-8 rounded-[1.8rem] border border-white/14 bg-[#0f1d2c]/72 p-4">
                    <label className="block">
                      <span className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">
                        <MapPin className="h-4 w-4" />
                       Search for available Destination
                      </span>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 sm:px-5 sm:py-5">
                        <MapPin className="h-4 w-4 text-white/55" />
                        <input
                          type="text"
                          placeholder="Search city or district"
                          value={locationFilter}
                          onChange={(event) => onLocationChange(event.target.value)}
                          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/42"
                        />
                      </div>
                    </label>

                    <Button
                      onClick={onSearch}
                      className="mt-3 h-12 w-full rounded-2xl bg-white text-sm font-semibold text-slate-950 hover:bg-white/92"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Search hotels
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
