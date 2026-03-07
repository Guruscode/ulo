'use client'

import { Button } from '@/components/ui/button'

const ALL_ESTATES = 'All Estates'

type EstateFilterProps = {
  estates: string[]
  activeEstate: string
  onSelect: (value: string) => void
}

export default function EstateFilter({ estates, activeEstate, onSelect }: EstateFilterProps) {
  if (estates.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-secondary">Estates</h3>
          <p className="mt-2 text-muted-foreground">
            Filter properties by featured estates and communities.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[ALL_ESTATES, ...estates].map((estate) => (
            <Button
              key={estate}
              variant={activeEstate === estate ? 'default' : 'outline'}
              size="sm"
              className={`transition-all ${
                activeEstate === estate
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'hover:bg-primary/10 hover:border-primary/50'
              }`}
              onClick={() => onSelect(estate)}
            >
              {estate}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
