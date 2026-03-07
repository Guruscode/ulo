import { Suspense } from 'react'
import HomeNav from '@/components/home/home-nav'
import ListingsContent from './ListingsContent'

function ListingsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[#f9f6f3]">
      <HomeNav />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
      </section>
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-11 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-200 animate-pulse">
              <div className="h-56 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                <div className="flex gap-4 pt-3">
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingsSkeleton />}>
      <HomeNav />
      <ListingsContent />
    </Suspense>
  )
}

