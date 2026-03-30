'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronLeft, Loader2, Mail, MapPin, Phone, Star, Users } from 'lucide-react'
import { toast } from 'sonner'

import HomeFooter from '@/components/home/home-footer'
import HomeNav from '@/components/home/home-nav'
import { FeaturedImageGallery } from '@/components/media/featured-image-gallery'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiClientError } from '@/lib/client/api-error'
import { createHotelBookingRequest, getHotelRequest } from '@/lib/client/hotels-client'
import { formatHotelPrice } from '@/lib/hotels/presentation'
import type { HotelBookingInput, HotelRecord } from '@/lib/hotels/types'

const EMPTY_BOOKING: HotelBookingInput = {
  roomId: '',
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  guestOrigin: '',
  adults: 1,
  children: 0,
  checkInDate: '',
  checkOutDate: '',
  departureTime: '',
}

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [hotel, setHotel] = useState<HotelRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [booking, setBooking] = useState<HotelBookingInput>(EMPTY_BOOKING)
  const [bookingSubmitting, setBookingSubmitting] = useState(false)

  useEffect(() => {
    const loadHotel = async () => {
      try {
        const response = await getHotelRequest(id)
        setHotel(response.hotel)
      } catch (_error) {
        setHotel(null)
      } finally {
        setLoading(false)
      }
    }
    void loadHotel()
  }, [id])

  const submitBooking = async () => {
    if (!hotel) return
    if (bookingSubmitting) return
    setBookingSubmitting(true)
    try {
      await createHotelBookingRequest(hotel.id, booking)
      toast.success('Booking request submitted successfully.')
      setBooking(EMPTY_BOOKING)
      setBookingOpen(false)
    } catch (error) {
      const message = error instanceof ApiClientError ? error.message : 'Unable to submit booking right now.'
      toast.error(message)
    } finally {
      setBookingSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading hotel...</div>

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Hotel Not Found</h1>
          <Link href="/hotels"><Button className="bg-primary hover:bg-primary/90">Back to Hotels</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4 flex items-center gap-2">
        <Link href="/" className="text-foreground/60 hover:text-foreground">Home</Link>
        <ChevronLeft className="w-4 h-4 text-foreground/40 rotate-180" />
        <Link href="/hotels" className="text-foreground/60 hover:text-foreground">Hotels</Link>
        <ChevronLeft className="w-4 h-4 text-foreground/40 rotate-180" />
        <span className="text-foreground font-medium">{hotel.name}</span>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <FeaturedImageGallery
          images={hotel.images}
          title={hotel.name}
          badgeLabel="Active"
        />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-full"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="text-sm font-semibold text-secondary">{hotel.rating}</span></div>
                <span className="text-sm text-muted-foreground">({hotel.reviewCount} reviews)</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-5 h-5" /><span>{hotel.location}</span></div>
            </div>
            <Card className="p-6"><h2 className="text-xl font-bold text-foreground mb-4">About This Hotel</h2><p className="text-foreground/70 leading-relaxed">{hotel.description}</p></Card>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2"><Check className="w-4 h-4 text-secondary" /><span className="text-sm text-foreground">{amenity}</span></div>
                ))}
              </div>
            </Card>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-72 h-48 md:h-auto bg-cover bg-center" style={{ backgroundImage: `url(${room.images[0]})` }} />
                      <div className="flex-1 p-5">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground mb-1">{room.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{room.description}</p>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1"><Users className="w-4 h-4" />Up to {room.maxGuests} guests</span>
                              <span>{room.bedType}</span>
                              <span>{room.size}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {room.amenities.slice(0, 4).map((amenity) => (
                                <span key={amenity} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">{amenity}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <div><span className="text-2xl font-bold text-secondary">{formatHotelPrice(room.priceValue)}</span><span className="text-sm text-muted-foreground"> / night</span></div>
                            <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                              <DialogTrigger asChild>
                                <Button className="bg-secondary hover:bg-secondary/90 text-white" disabled={bookingSubmitting} onClick={() => setBooking({ ...EMPTY_BOOKING, roomId: room.id })}>Book Now</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader><DialogTitle className="text-2xl font-serif">Make a Reservation</DialogTitle><DialogDescription>Book your stay at {hotel.name}</DialogDescription></DialogHeader>
                                <div className="space-y-6 py-4">
                                  <div className="space-y-2"><Label>Your Name *</Label><Input value={booking.guestName} onChange={(event) => setBooking({ ...booking, guestName: event.target.value })} /></div>
                                  <div className="space-y-2"><Label>Email Address *</Label><Input type="email" value={booking.guestEmail} onChange={(event) => setBooking({ ...booking, guestEmail: event.target.value })} /></div>
                                  <div className="space-y-2"><Label>Phone Number *</Label><Input value={booking.guestPhone} onChange={(event) => setBooking({ ...booking, guestPhone: event.target.value })} /></div>
                                  <div className="space-y-2"><Label>Where are you coming from? *</Label><Input value={booking.guestOrigin} onChange={(event) => setBooking({ ...booking, guestOrigin: event.target.value })} /></div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Check-in Date *</Label><Input type="date" value={booking.checkInDate} onChange={(event) => setBooking({ ...booking, checkInDate: event.target.value })} /></div>
                                    <div className="space-y-2"><Label>Check-out Date *</Label><Input type="date" value={booking.checkOutDate} onChange={(event) => setBooking({ ...booking, checkOutDate: event.target.value })} /></div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Adults</Label><Input type="number" min="1" value={booking.adults} onChange={(event) => setBooking({ ...booking, adults: Number(event.target.value) })} /></div>
                                    <div className="space-y-2"><Label>Children</Label><Input type="number" min="0" value={booking.children} onChange={(event) => setBooking({ ...booking, children: Number(event.target.value) })} /></div>
                                  </div>
                                  <Button type="button" className="w-full bg-secondary hover:bg-secondary/90 text-white" disabled={bookingSubmitting} onClick={() => void submitBooking()}>
                                    {bookingSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : 'Submit Reservation'}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Contact Hotel</h3>
              <div className="space-y-3">
                <a href={`tel:${hotel.contactPhone}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground"><Phone className="w-5 h-5 text-secondary" />{hotel.contactPhone}</a>
                <a href={`mailto:${hotel.contactEmail}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground"><Mail className="w-5 h-5 text-secondary" />{hotel.contactEmail}</a>
                <div className="flex items-start gap-3 text-muted-foreground"><MapPin className="w-5 h-5 text-secondary mt-0.5" /><span>{hotel.contactAddress}</span></div>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-secondary to-secondary/80 text-white">
              <h3 className="text-lg font-bold mb-2">Quick Booking</h3>
              <p className="text-white/80 text-sm mb-4">Ready to book? Select a room and start your reservation.</p>
              <Button className="w-full bg-white text-secondary hover:bg-white/90 font-semibold" disabled={bookingSubmitting} onClick={() => { if (hotel.rooms[0]) { setBooking({ ...EMPTY_BOOKING, roomId: hotel.rooms[0].id }); setBookingOpen(true) } }}>Book Now</Button>
            </Card>
          </div>
        </div>
      </section>
      <HomeFooter />
    </div>
  )
}
