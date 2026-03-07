'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/components/home/animations'
import PropertyCard from '@/components/home/property-card'
import type { Property } from '@/components/home/types'

type HomePropertiesProps = {
  allProperties: Property[]
  filteredProperties: Property[]
}

const ITEMS_LIMIT = 20

export default function HomeProperties({ allProperties, filteredProperties }: HomePropertiesProps) {
  const displayedProperties = filteredProperties.slice(0, ITEMS_LIMIT)
  const hasMore = filteredProperties.length > ITEMS_LIMIT

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
              {filteredProperties.length === allProperties.length
                ? 'Featured Properties'
                : `Found ${filteredProperties.length} ${filteredProperties.length === 1 ? 'Property' : 'Properties'}`}
            </h2>
            {filteredProperties.length === 0 && (
              <p className="mt-3 text-lg text-muted-foreground">
                No properties match your search — try different filters
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">For Sale</Button>
            <Button variant="outline" size="sm">For Rent</Button>
            <Button variant="outline" size="sm">Price: Low to High</Button>
            <Button variant="outline" size="sm">Most Recent</Button>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-lg">
            No matching properties found.
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
            >
              {displayedProperties.map((property) => (
                <motion.div key={property.id} variants={fadeInUp}>
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>

            {hasMore && (
              <div className="flex justify-center pt-8">
                <Link href="/listings">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-8">
                    View More Properties
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </motion.div>
    </section>
  )
}
