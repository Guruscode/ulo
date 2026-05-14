import { Suspense } from 'react'

import HomeNav from '@/components/home/home-nav'
import { HotelGridSkeleton } from '@/components/ui/page-skeletons'

import HotelsContent from './HotelsContent'

function HotelsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <section className="bg-gradient-to-b from-secondary/10 to-transparent pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 h-12 w-72 animate-pulse rounded bg-gray-200" />
            <div className="mx-auto h-6 w-full max-w-2xl animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mx-auto h-11 max-w-md animate-pulse rounded bg-gray-200" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mb-8 h-10 w-40 animate-pulse rounded bg-gray-200" />
        <HotelGridSkeleton />
      </section>
    </div>
  )
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<HotelsPageSkeleton />}>
      <HomeNav />
      <HotelsContent />
    </Suspense>
  )
}
