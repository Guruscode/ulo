'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import {
  CircleAlert,
  ChevronRight,
  Droplets,
  Heart,
  MapPin,
  Share2,
  Sofa,
  Zap,
} from 'lucide-react'
import { motion } from 'framer-motion'

import HomeNav from '@/components/home/home-nav'
import { FeaturedImageGallery } from '@/components/media/featured-image-gallery'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PropertyDetailSkeleton } from '@/components/ui/page-skeletons'
import { getPropertyRequest, savePropertyRequest, unsavePropertyRequest } from '@/lib/client/properties-client'
import { DEFAULT_PROPERTY_IMAGE, resolveImageUrl } from '@/lib/media/defaults'
import { formatPropertyPrice } from '@/lib/properties/presentation'
import type { PropertyRecord } from '@/lib/properties/types'
import { toast } from 'sonner'

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [property, setProperty] = useState<PropertyRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPhone, setShowPhone] = useState(false)
  const { isAuthenticated } = useAuth()

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
    return <PropertyDetailSkeleton />
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
  const contactRoleLabel = property.listedBy === 'Owner' ? 'Owner' : property.listedBy === 'Landlord' ? 'Landlord' : 'Agent'
  const maskedPhone = maskPhoneNumber(property.contactPhone)
  const images =
    property.imageUrls.length > 0
      ? property.imageUrls.map((imageUrl) => resolveImageUrl(imageUrl, DEFAULT_PROPERTY_IMAGE))
      : [DEFAULT_PROPERTY_IMAGE]

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
          <FeaturedImageGallery
            images={images}
            title={property.title}
            badgeLabel={property.status === 'active' ? 'Active' : property.status.replace('_', ' ')}
          />

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">{property.title}</h1>
              </div>
              <div className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Listed by {listedByLabel}
              </div>
              <div className="flex items-center gap-2 text-foreground/70 mb-4">
                <MapPin className="w-5 h-5" />
                <p className="text-lg">{property.location}</p>
              </div>
              <p className="text-4xl font-bold text-primary">{formatPropertyPrice(property)}</p>
            </div>
            <div className="flex gap-3 md:flex-col">
              <button
                onClick={() => {
                  if (!property) return
                  if (!isAuthenticated) {
                    window.location.href = '/login'
                    return
                  }
                  const nextSaved = !property.isSaved
                  setProperty({ ...property, isSaved: nextSaved })
                  const request = nextSaved ? savePropertyRequest(property.id) : unsavePropertyRequest(property.id)
                  void request.catch(() => {
                    setProperty({ ...property, isSaved: !nextSaved })
                    toast.error('Unable to update saved property right now.')
                  })
                }}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${property.isSaved ? 'bg-primary text-white hover:bg-primary/90' : 'bg-secondary/10 text-foreground hover:bg-secondary/20'}`}
              >
                <Heart className="w-5 h-5 inline mr-2" />
                {property.isSaved ? 'Saved' : 'Save'}
              </button>
              <button className="px-4 py-3 rounded-lg bg-secondary/10 text-foreground hover:bg-secondary/20 font-medium transition-all">
                <Share2 className="w-5 h-5 inline mr-2" />
                Share
              </button>
            </div>
          </div>

          {property.type !== 'Land' ? (
            <div className="grid grid-cols-2 gap-4 md:max-w-xl">
              <Card className="p-4"><div className="flex items-center gap-3 mb-2"><Sofa className="w-5 h-5 text-primary" /><p className="text-sm text-foreground/60">Bedrooms</p></div><p className="text-2xl font-bold text-foreground">{property.bedrooms}</p></Card>
              <Card className="p-4"><div className="flex items-center gap-3 mb-2"><Droplets className="w-5 h-5 text-primary" /><p className="text-sm text-foreground/60">Bathrooms</p></div><p className="text-2xl font-bold text-foreground">{property.bathrooms}</p></Card>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 bg-white"><p className="text-sm text-foreground/60 mb-2">Listed By</p><p className="text-xl font-bold text-foreground">{listedByLabel}</p><p className="text-sm text-foreground/70 mt-2">This listing was submitted by a {listedByLabel.toLowerCase()} on the platform.</p></Card>
            <Card className="p-5 bg-white"><p className="text-sm text-foreground/60 mb-2">Property Type</p><p className="text-xl font-bold text-foreground">{property.type}</p><p className="text-sm text-foreground/70 mt-2">Approval status: {property.approvalStatus.replace('_', ' ')}. {property.viewsCount ?? 0} views.</p></Card>
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

          <Card className="overflow-hidden border border-slate-200 bg-white p-0 shadow-none">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 md:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <CircleAlert className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">Safety Tips</h2>
                  <p className="text-sm text-slate-600 md:text-base">
                    A few checks to make before you pay or commit.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-6 md:grid-cols-2 md:px-8 md:py-8">
              {[
                'Do not pay any inspection fee before seeing both the agent and the property.',
                'Only make rental, sales, or other upfront payments after verifying the landlord.',
                'Arrange to meet the agent in an open, public location.',
                'ULO does not represent the advertiser and is not liable for monetary transactions between you and the agent.',
              ].map((tip, index) => (
                <div key={tip} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="text-base leading-7 text-slate-700">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-0 bg-gradient-to-r from-[#fff1bf] via-[#ffd6e7] to-[#c8f7ff] p-8 text-slate-950">
            <h2 className="text-2xl font-bold mb-4">Interested in This Property?</h2>
            <p className="mb-6 text-slate-700">Contact the {contactRoleLabel.toLowerCase()} directly or start a verification request before you commit.</p>
            <div className="grid gap-4 lg:grid-cols-3">
              {showPhone ? (
                <a href={`tel:${property.contactPhone}`} className="flex-1">
                  <Button size="lg" className="flex h-full min-h-[76px] w-full items-center border-0 bg-[#2563eb] px-5 py-4 text-white hover:bg-[#1d4ed8]">
                    <span className="flex flex-col items-start text-left">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                        Call {contactRoleLabel}
                      </span>
                      <span className="text-lg font-bold">{property.contactPhone}</span>
                    </span>
                  </Button>
                </a>
              ) : (
                <Button
                  size="lg"
                  onClick={() => setShowPhone(true)}
                  className="flex min-h-[76px] w-full items-center bg-[#2563eb] px-5 py-4 text-white hover:bg-[#1d4ed8]"
                >
                  <span className="flex w-full items-center justify-between gap-4">
                    <span className="flex flex-col items-start text-left">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                        Call {contactRoleLabel}
                      </span>
                      <span className="text-lg font-bold">{maskedPhone}</span>
                    </span>
                    <span className="rounded-full border border-white/50 bg-white/10 px-4 py-1 text-sm font-semibold text-white">
                      Show
                    </span>
                  </span>
                </Button>
              )}
              <a href={`mailto:${property.contactEmail}`} className="flex-1">
                <Button
                  size="lg"
                  className="min-h-[76px] w-full border-0 bg-[#22c55e] px-5 py-4 text-left text-white hover:bg-[#16a34a]"
                >
                  <span className="flex flex-col items-start">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      Email {contactRoleLabel}
                    </span>
                    <span className="text-lg font-bold">{property.contactEmail}</span>
                  </span>
                </Button>
              </a>
              <Link
                className="flex-1"
                href={{
                  pathname: '/verify-property',
                  query: {
                    propertyId: property.id,
                    title: property.title,
                    location: property.location,
                    address: property.fullAddress,
                  },
                }}
              >
                <Button size="lg" className="min-h-[76px] w-full bg-[#f97316] px-5 py-4 text-white hover:bg-[#ea580c]">
                  <span className="flex flex-col items-start text-left">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      Verification
                    </span>
                    <span className="text-lg font-bold">Verify This Property</span>
                  </span>
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}

function maskPhoneNumber(phone: string) {
  if (phone.length <= 6) {
    return phone
  }

  const visiblePrefix = phone.slice(0, Math.min(6, phone.length - 3))
  const visibleSuffix = phone.slice(-3)
  return `${visiblePrefix}***${visibleSuffix}`
}
