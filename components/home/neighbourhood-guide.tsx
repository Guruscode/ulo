'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { neighbourhoods } from '@/lib/neighbourhoods'
import { fadeInUp, staggerContainer } from '@/components/home/animations'

export default function NeighbourhoodGuide() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="space-y-10">
        <div className="flex flex-col gap-3">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary">
            Neighbourhood Guide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore vibrant neighbourhoods across Nigeria and discover your perfect location
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
        >
          {neighbourhoods.map((neighbourhood) => (
            <motion.div key={neighbourhood.id} variants={fadeInUp}>
              <Link href={`/neighbourhoods/${neighbourhood.slug}`}>
                <Card className="overflow-hidden h-64 cursor-pointer hover:shadow-lg transition-all duration-300 group">
                  <div
                    className="relative w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `url(${neighbourhood.image})`,
                    }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                      <div />
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold font-serif">{neighbourhood.name}</h3>
                        <p className="text-sm text-gray-200">
                          {neighbourhood.coordinates.lat}
                          <br />
                          {neighbourhood.coordinates.lng}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
