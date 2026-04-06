import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PropertyGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden border-0 bg-white shadow-sm">
          <Skeleton className="h-64 w-full rounded-none" />
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export function HotelGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="h-56 w-full rounded-none" />
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export function StackedCardListSkeleton({
  count = 4,
  showImage = false,
}: {
  count?: number
  showImage?: boolean
}) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-1 gap-4">
              {showImage ? <Skeleton className="h-24 w-32 shrink-0 rounded-xl" /> : null}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[#f9f6f3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex items-center gap-2">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-[420px] w-full rounded-3xl" />

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Skeleton className="h-12 w-72" />
            <Skeleton className="h-8 w-36 rounded-full" />
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="flex gap-3 md:flex-col">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:max-w-xl">
          <Card className="p-4"><Skeleton className="h-20 w-full" /></Card>
          <Card className="p-4"><Skeleton className="h-20 w-full" /></Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-5">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-7 w-40" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-5 w-full" />
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-[360px] w-full rounded-2xl" />
          </div>
        </Card>
      </section>
    </div>
  )
}

export function HotelDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4 flex items-center gap-2">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Skeleton className="h-[420px] w-full rounded-3xl" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="space-y-3">
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-12 w-72" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Card className="p-6"><Skeleton className="h-36 w-full" /></Card>
            <Card className="p-6"><Skeleton className="h-36 w-full" /></Card>
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <Skeleton className="h-48 md:h-auto md:w-72 rounded-none" />
                    <div className="flex-1 space-y-4 p-5">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <Card className="p-6"><Skeleton className="h-80 w-full" /></Card>
        </div>
      </section>
    </div>
  )
}
