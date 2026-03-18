'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import {
  Calendar,
  ChevronRight,
  Droplets,
  Heart,
  MapPin,
  Ruler,
  Share2,
  Sofa,
  Zap,
} from 'lucide-react'
import { motion } from 'framer-motion'

import HomeNav from '@/components/home/home-nav'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { ApiClientError } from '@/lib/client/api-error'
import { getPropertyRequest } from '@/lib/client/properties-client'
import { formatPropertyPrice } from '@/lib/properties/presentation'
import type { PropertyRecord } from '@/lib/properties/types'

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [property, setProperty] = useState<PropertyRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await getPropertyRequest(id)
        setProperty(response.property)
      } catch (_error) {
        setProperty(null)
      } finally {
        setLoading(false)
      }
    }

    void loadProperty()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/70">Loading property...</p>
      </div>
    )
  }

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

  const mapQuery =
    property.latitude !== null && property.longitude !== null
      ? `${property.latitude},${property.longitude}`
      : encodeURIComponent(`${property.title}, ${property.location}`)

  const listedByLabel = property.listedBy
  const images = property.imageUrls

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-[#f9f6f3]">
      <HomeNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex items-center gap-2">
        <Link href="/" className="text-foreground/60 hover:text-foreground">Home</Link>
        <ChevronRight className="w-4 h-4 text-foreground/40" />
        <Link href="/listings" className="text-foreground/60 hover:text-foreground">Properties</Link>
        <ChevronRight className="w-4 h-4 text-foreground/40" />
        <span className="text-foreground font-medium">{property.title}</span>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 h-96 md:h-[500px] rounded-2xl bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${images[activeImageIndex]})` }} />
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {images.map((image, index) => (
                <button
                  key={image}
                  className={`h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/50'}`}
                  style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">{property.title}</h1>
              </div>
              <div className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Posted by {listedByLabel}
              </div>
              <div className="flex items-center gap-2 text-foreground/70 mb-4">
                <MapPin className="w-5 h-5" />
                <p className="text-lg">{property.location}</p>
              </div>
              <p className="text-4xl font-bold text-primary">{formatPropertyPrice(property)}</p>
            </div>
            <div className="flex gap-3 md:flex-col">
              <button onClick={() => setIsFavorited(!isFavorited)} className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${isFavorited ? 'bg-primary text-white hover:bg-primary/90' : 'bg-secondary/10 text-foreground hover:bg-secondary/20'}`}>
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
            <Card className="p-4"><div className="flex items-center gap-3 mb-2"><Sofa className="w-5 h-5 text-primary" /><p className="text-sm text-foreground/60">Bedrooms</p></div><p className="text-2xl font-bold text-foreground">{property.bedrooms}</p></Card>
            <Card className="p-4"><div className="flex items-center gap-3 mb-2"><Droplets className="w-5 h-5 text-primary" /><p className="text-sm text-foreground/60">Bathrooms</p></div><p className="text-2xl font-bold text-foreground">{property.bathrooms}</p></Card>
            <Card className="p-4"><div className="flex items-center gap-3 mb-2"><Ruler className="w-5 h-5 text-primary" /><p className="text-sm text-foreground/60">Square Feet</p></div><p className="text-2xl font-bold text-foreground">{property.sqft.toLocaleString()}</p></Card>
            <Card className="p-4"><div className="flex items-center gap-3 mb-2"><Calendar className="w-5 h-5 text-primary" /><p className="text-sm text-foreground/60">Year Built</p></div><p className="text-2xl font-bold text-foreground">{property.yearBuilt || 'N/A'}</p></Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 bg-white"><p className="text-sm text-foreground/60 mb-2">Posted By</p><p className="text-xl font-bold text-foreground">{listedByLabel}</p><p className="text-sm text-foreground/70 mt-2">This listing was submitted by a {listedByLabel.toLowerCase()} on the platform.</p></Card>
            <Card className="p-5 bg-white"><p className="text-sm text-foreground/60 mb-2">Property Type</p><p className="text-xl font-bold text-foreground">{property.type}</p><p className="text-sm text-foreground/70 mt-2">Approval status: {property.approvalStatus.replace('_', ' ')}.</p></Card>
            <Card className="p-5 bg-white"><p className="text-sm text-foreground/60 mb-2">Estate / Area</p><p className="text-xl font-bold text-foreground">{property.estate || property.location}</p><p className="text-sm text-foreground/70 mt-2">Reference code: {property.referenceCode}</p></Card>
          </div>

          <Card className="p-8 bg-white">
            <h2 className="text-2xl font-bold text-foreground mb-4">About This Property</h2>
            <p className="text-foreground/70 leading-relaxed text-lg mb-8">{property.description}</p>
            <h3 className="text-xl font-bold text-foreground mb-4">Key Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <p className="text-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden bg-white">
            <div className="p-8 pb-4">
              <h2 className="text-2xl font-bold text-foreground mb-2">Property Location Map</h2>
              <p className="text-foreground/70">Use the map below to locate this property and understand its position within the neighbourhood.</p>
            </div>
            <div className="px-8 pb-3">
              <div className="rounded-2xl overflow-hidden border border-border">
                <iframe
                  title={`${property.title} map`}
                  src={`https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                  className="h-[360px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div className="px-8 pb-8 text-sm text-foreground/60">Map centered on {property.location}.</div>
          </Card>

          <Card className="border-amber-200 bg-amber-50 p-6">
            <h2 className="text-lg font-bold text-amber-900 mb-2">Disclaimer</h2>
            <p className="text-sm leading-6 text-amber-800">
              ULO is not affiliated with this property listing or the party that posted it. We recommend that you contact us first if you want help verifying the authenticity, availability, and details of this property before making any commitment.
            </p>
          </Card>

          <Card className="p-8 bg-gradient-to-r from-primary to-secondary text-white">
            <h2 className="text-2xl font-bold mb-4">Interested in This Property?</h2>
            <p className="mb-6 text-white/90">Contact our team today to schedule a tour or get more information.</p>
            <div className="flex flex-col lg:flex-row gap-4">
              <a href={`tel:${property.contactPhone}`} className="flex-1">
                <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90">Call Contact</Button>
              </a>
              <a href={`mailto:${property.contactEmail}`} className="flex-1">
                <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10">Email Contact</Button>
              </a>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="lg" variant="outline" className="flex-1 border-white text-white hover:bg-white/10">
                    Verify This Property
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Verify This Property</AlertDialogTitle>
                    <AlertDialogDescription>
                      ULO can help you verify the property details, ownership claims, and current availability before you proceed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Link href="/help">Contact Admin</Link>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
