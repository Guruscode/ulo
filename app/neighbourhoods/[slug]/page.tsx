'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, MapPin, Users, Briefcase, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import { neighbourhoods } from '@/lib/neighbourhoods'
import { motion } from 'framer-motion'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function NeighbourhoodDetailPage({ params }: PageProps) {
  const { slug } = use(params)
  const neighbourhood = neighbourhoods.find((n) => n.slug === slug)

  if (!neighbourhood) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${neighbourhood.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/">
            <Button variant="secondary" size="icon" className="bg-white/90 hover:bg-white">
              <ChevronLeft className="w-5 h-5 text-secondary" />
            </Button>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">{neighbourhood.name}</h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl">{neighbourhood.description}</p>
            <div className="flex flex-col md:flex-row gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{neighbourhood.coordinates.lat}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{neighbourhood.coordinates.lng}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-12">
          {/* About Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-4">About</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{neighbourhood.fullDescription}</p>
              </div>

              {/* Highlights */}
              <div>
                <h3 className="text-2xl font-serif font-bold text-secondary mb-4">Key Highlights</h3>
                <div className="grid grid-cols-2 gap-3">
                  {neighbourhood.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Demographics Card */}
            <div className="bg-secondary/5 rounded-lg p-6 border border-secondary/10 h-fit sticky top-24">
              <h3 className="text-xl font-serif font-bold text-secondary mb-6">Demographics</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Population</p>
                    <p className="font-semibold text-foreground">{neighbourhood.demographics.population}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Average Income</p>
                    <p className="font-semibold text-foreground">{neighbourhood.demographics.avgIncome}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Average Age</p>
                    <p className="font-semibold text-foreground">{neighbourhood.demographics.avgAge}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-6">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {neighbourhood.amenities.map((amenity, idx) => (
                <Card key={idx} className="p-4 text-center hover:shadow-md transition-shadow">
                  <p className="text-sm md:text-base text-muted-foreground">{amenity}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Development Phases */}
          {neighbourhood.phases && neighbourhood.phases.length > 0 && (
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary mb-6">Development Phases</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {neighbourhood.phases.map((phase, idx) => (
                  <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-gradient-to-br from-secondary/20 to-secondary/5">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${phase.image})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-black/30" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-secondary mb-2">{phase.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-8 text-center">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-secondary mb-4">
              Ready to Explore {neighbourhood.name}?
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Discover available properties in this thriving neighbourhood and find your perfect home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/listings?location=${neighbourhood.name}`}>
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
                  View Properties
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <HomeFooter />
    </div>
  )
}
