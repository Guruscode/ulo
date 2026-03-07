'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import type { Estate } from '@/components/home/types'

type EstateSectionProps = {
  estates: Estate[]
}

export default function EstateSection({ estates }: EstateSectionProps) {
  if (estates.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-secondary">Estates</h3>
          <p className="mt-2 text-muted-foreground">
            Browse curated estates and see all homes within each community.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {estates.map((estate) => (
          <Link key={estate.slug} href={`/estates/${estate.slug}`}>
            <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div
                className="relative h-56 bg-cover bg-center"
                style={{ backgroundImage: `url(${estate.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/75 transition-all duration-300" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-xl font-semibold">{estate.name}</h4>
                  <p className="text-sm text-white/80">{estate.location}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
