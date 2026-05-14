'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import PropertyCard from '@/components/home/property-card'
import type { Property } from '@/components/home/types'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination'

type ListedPropertiesSectionProps = {
  properties: Property[]
  loading?: boolean
}

const HOMEPAGE_LIMIT = 6

export default function ListedPropertiesSection({
  properties,
  loading = false,
}: ListedPropertiesSectionProps) {
  const displayedProperties = properties.slice(0, HOMEPAGE_LIMIT)

  return (
    <section className="bg-[#f7f5f1] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Listed properties
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              Check out our latest listings
            </h2>
           
          </div>

          <Link href="/listings">
            <Button className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800">
              Browse all listings
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(HOMEPAGE_LIMIT)].map((_, index) => (
              <div key={index} className="h-[430px] animate-pulse rounded-[1.8rem] bg-white shadow-sm" />
            ))}
          </div>
        ) : displayedProperties.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center text-slate-600">
            No public listings are available right now.
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="text-sm text-slate-500">
                Showing {displayedProperties.length} of {properties.length} listings
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink href="/" isActive size="default" className="rounded-full border border-slate-900 px-4">
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="/listings" size="default" className="rounded-full px-4">
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="/listings" size="default" className="rounded-full px-4">
                      3
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="/listings" className="rounded-full" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
