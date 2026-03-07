'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import PropertyCard from '@/components/home/property-card'
import { fadeInUp, staggerContainer } from '@/components/home/animations'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Property } from '@/components/home/types'

type RecommendedPropertiesProps = {
  properties: Property[]
}

export default function RecommendedProperties({ properties }: RecommendedPropertiesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerSlide = 4
  const recommended = properties.slice(0, Math.max(8, properties.length))

  if (recommended.length === 0) return null

  const maxIndex = Math.ceil(recommended.length / itemsPerSlide) - 1

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
  }

  const visibleProperties = recommended.slice(currentIndex * itemsPerSlide, (currentIndex + 1) * itemsPerSlide)

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
              Recommended Properties
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Handpicked properties perfect for your needs
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full border border-foreground/20 hover:bg-foreground/5 transition-all duration-300"
              aria-label="Previous properties"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground min-w-fit">
              {currentIndex + 1} / {maxIndex + 1}
            </span>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full border border-foreground/20 hover:bg-foreground/5 transition-all duration-300"
              aria-label="Next properties"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
        >
          {visibleProperties.map((property) => (
            <motion.div key={property.id} variants={fadeInUp}>
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center pt-8">
          <Link href="/listings">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white px-8">
              View All Recommended
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
