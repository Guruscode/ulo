'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import {
  MapPin,
  Heart,
  Share2,
  Zap,
  Droplets,
  Sofa,
  Ruler,
  Calendar,
  ChevronRight,
} from 'lucide-react'
import { useState, use } from 'react'
import { motion } from 'framer-motion'
import HomeNav from '@/components/home/home-nav'

import { homeProperties } from '@/lib/home-properties'
import type { Property } from '@/components/home/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const numericId = Number(id)

  const property = homeProperties.find(p => p.id === numericId)

  const [isFavorited, setIsFavorited] = useState(false)
  const [activeImageIndex] = useState(0) // only one image for now

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Property Not Found</h1>
          <Link href="/listings">
            <Button className="bg-primary hover:bg-primary/90">Back to Listings</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Helper to format price nicely
  const formatPrice = () => {
    const value = property.priceValue.toLocaleString()
    const symbol = property.currency === 'NGN' ? '₦' : '$'
    const period =
      property.type === 'For Rent' || property.type === 'Shortlet'
        ? property.currency === 'NGN'
          ? ' / week'
          : ' / mo'
        : ''
    return `${symbol}${value}${period}`
  }

  // Fallback data for missing fields
  const yearBuilt = 2015 + (property.id % 10) // fake but realistic range 2015–2024
  const sqftNumber = Number(property.sqft.replace(/,/g, ''))
  const description = `This beautiful ${property.type.toLowerCase()} in ${property.location} offers ${property.bedrooms} bedroom(s), ${property.bathrooms} bathroom(s) and ${property.sqft} of living space. Listed by ${property.listedBy}.`

  const features = [
    `${property.bedrooms} Bedroom${property.bedrooms !== 1 ? 's' : ''}`,
    `${property.bathrooms} Bathroom${property.bathrooms !== 1 ? 's' : ''}`,
    `${property.sqft} sqft`,
    property.estate ? `Estate: ${property.estate}` : null,
    property.views ? `${property.views.toLocaleString()} views` : null,
    ... (property.badges || []).map(b => `Featured: ${b}`),
  ].filter(Boolean) as string[]

  // For now we only have one real image – duplicating with slight variation for gallery feel
  const images = [
    property.image,
    property.image.replace(/w=1920/, 'w=1600&q=85'),
    property.image.replace(/w=1920/, 'w=1200&q=70'),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[#f9f6f3]">
           {/* Navigation */}
           <HomeNav />
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex items-center gap-2">
        <Link href="/" className="text-foreground/60 hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-foreground/40" />
        <Link href="/listings" className="text-foreground/60 hover:text-foreground">
          Properties
        </Link>
        <ChevronRight className="w-4 h-4 text-foreground/40" />
        <span className="text-foreground font-medium">{property.title}</span>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div
              className="md:col-span-3 h-96 md:h-[500px] rounded-2xl bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: `url(${images[activeImageIndex]})` }}
            />
            <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === index
                      ? 'border-primary shadow-lg'
                      : 'border-transparent hover:border-primary/50'
                  }`}
                  style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }}
                />
              ))}
            </div>
          </div>

          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">{property.title}</h1>
              </div>
              <div className="flex items-center gap-2 text-foreground/70 mb-4">
                <MapPin className="w-5 h-5" />
                <p className="text-lg">{property.location}</p>
              </div>
              <p className="text-4xl font-bold text-primary">{formatPrice()}</p>
            </div>
            <div className="flex gap-3 md:flex-col">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                  isFavorited
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-secondary/10 text-foreground hover:bg-secondary/20'
                }`}
              >
                <Heart className="w-5 h-5 inline mr-2" />
                {isFavorited ? 'Saved' : 'Save'}
              </button>
              <button className="px-4 py-3 rounded-lg bg-secondary/10 text-foreground hover:bg-secondary/20 font-medium transition-all">
                <Share2 className="w-5 h-5 inline mr-2" />
                Share
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Sofa className="w-5 h-5 text-primary" />
                <p className="text-sm text-foreground/60">Bedrooms</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{property.bedrooms}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Droplets className="w-5 h-5 text-primary" />
                <p className="text-sm text-foreground/60">Bathrooms</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{property.bathrooms}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Ruler className="w-5 h-5 text-primary" />
                <p className="text-sm text-foreground/60">Square Feet</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{sqftNumber.toLocaleString()}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <p className="text-sm text-foreground/60">Year Built</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{yearBuilt}</p>
            </Card>
          </div>

          {/* Description */}
          <Card className="p-8 bg-white">
            <h2 className="text-2xl font-bold text-foreground mb-4">About This Property</h2>
            <p className="text-foreground/70 leading-relaxed text-lg mb-8">{description}</p>

            <h3 className="text-xl font-bold text-foreground mb-4">Key Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <p className="text-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Contact Section */}
          <Card className="p-8 bg-gradient-to-r from-primary to-secondary text-white">
            <h2 className="text-2xl font-bold mb-4">Interested in This Property?</h2>
            <p className="mb-6 text-white/90">
              Contact our team today to schedule a tour or get more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 flex-1">
                Schedule a Tour
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 flex-1 bg-transparent"
                  >
                    Contact Agent
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[400px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign In Required</AlertDialogTitle>
                    <AlertDialogDescription>
                      Please sign in to contact this agent and access their services.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                    <Link href="/login" className="w-full sm:w-auto">
                      <AlertDialogAction className="w-full bg-secondary hover:bg-secondary/90">
                        Sign In
                      </AlertDialogAction>
                    </Link>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>

          {/* Back to Listings */}
          <div className="text-center pt-8">
            <Link href="/listings">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/5 bg-transparent"
              >
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Back to Listings
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}