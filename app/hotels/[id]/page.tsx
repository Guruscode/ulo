'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import HomeNav from '@/components/home/home-nav'
import HomeFooter from '@/components/home/home-footer'
import { hotels } from '@/lib/hotels'
import { 
  MapPin, Star, Wifi, Waves, Utensils, Car, Dumbbell, 
  Phone, Mail, ChevronLeft, Calendar, Users, Clock,
  Check
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const amenityIcons: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi className="w-5 h-5" />,
  'Free High-Speed WiFi': <Wifi className="w-5 h-5" />,
  'Swimming Pool': <Waves className="w-5 h-5" />,
  'Outdoor Pool': <Waves className="w-5 h-5" />,
  'Infinity Pool': <Waves className="w-5 h-5" />,
  'Private Beach': <Waves className="w-5 h-5" />,
  'Restaurant & Bar': <Utensils className="w-5 h-5" />,
  'Restaurant': <Utensils className="w-5 h-5" />,
  'Fine Dining Restaurant': <Utensils className="w-5 h-5" />,
  'Multiple Restaurants': <Utensils className="w-5 h-5" />,
  'Parking': <Car className="w-5 h-5" />,
  'Valet Parking': <Car className="w-5 h-5" />,
  'Fitness Center': <Dumbbell className="w-5 h-5" />,
  'Spa & Wellness': <Star className="w-5 h-5" />,
  'Spa': <Star className="w-5 h-5" />,
}

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const hotel = hotels.find(h => h.id === id)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Hotel Not Found</h1>
          <Link href="/hotels">
            <Button className="bg-primary hover:bg-primary/90">Back to Hotels</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeNav />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4 flex items-center gap-2">
        <Link href="/" className="text-foreground/60 hover:text-foreground">
          Home
        </Link>
        <ChevronLeft className="w-4 h-4 text-foreground/40 rotate-180" />
        <Link href="/hotels" className="text-foreground/60 hover:text-foreground">
          Hotels
        </Link>
        <ChevronLeft className="w-4 h-4 text-foreground/40 rotate-180" />
        <span className="text-foreground font-medium">{hotel.name}</span>
      </div>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className="md:col-span-2 h-80 md:h-[450px] rounded-2xl bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: `url(${hotel.images[activeImageIndex]})` }}
          />
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {hotel.images.slice(1, 5).map((img, index) => (
              <div
                key={index}
                className={`h-40 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  activeImageIndex === index + 1
                    ? 'border-secondary shadow-lg'
                    : 'border-transparent hover:border-secondary/50'
                }`}
                style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }}
                onClick={() => setActiveImageIndex(index + 1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-secondary">{hotel.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({hotel.reviewCount} reviews)</span>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>{hotel.location}</span>
              </div>
            </div>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">About This Hotel</h2>
              <p className="text-foreground/70 leading-relaxed">{hotel.description}</p>
            </Card>

            {/* Amenities */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                      {amenityIcons[amenity] || <Check className="w-5 h-5" />}
                    </div>
                    <span className="text-sm text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Rooms */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      {/* Room Image */}
                      <div className="md:w-72 h-48 md:h-auto bg-cover bg-center" style={{ backgroundImage: `url(${room.images[0]})` }} />
                      
                      {/* Room Details */}
                      <div className="flex-1 p-5">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground mb-1">{room.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{room.description}</p>
                            
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                Up to {room.maxGuests} guests
                              </span>
                              <span>{room.bedType}</span>
                              <span>{room.size}</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {room.amenities.slice(0, 4).map((amenity, idx) => (
                                <span key={idx} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                                  {amenity}
                                </span>
                              ))}
                              {room.amenities.length > 4 && (
                                <span className="text-xs text-muted-foreground">
                                  +{room.amenities.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <div>
                              <span className="text-2xl font-bold text-secondary">₦{room.price.replace('₦', '')}</span>
                              <span className="text-sm text-muted-foreground"> / night</span>
                            </div>
                            
                            <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  className="bg-secondary hover:bg-secondary/90 text-white"
                                  onClick={() => setSelectedRoom(room.id)}
                                >
                                  Book Now
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-serif">Make a Reservation</DialogTitle>
                                  <DialogDescription>
                                    Book your luxury stay at {hotel.name}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <form className="space-y-6 py-4">
                                  {/* Personal Information */}
                                  <div className="space-y-4">
                                    <h3 className="font-semibold text-foreground">Personal Information</h3>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="name">Your Name *</Label>
                                      <Input id="name" placeholder="Enter your full name" required />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="phone">Phone Number *</Label>
                                      <Input id="phone" type="tel" placeholder="+234 xxx xxx xxxx" required />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="origin">Where are you coming from? *</Label>
                                      <Input id="origin" placeholder="City, State, or Country" required />
                                    </div>
                                  </div>

                                  {/* Stay Details */}
                                  <div className="space-y-4">
                                    <h3 className="font-semibold text-foreground">Stay Details</h3>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="checkin">Check-in Date *</Label>
                                        <Input id="checkin" type="date" required />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="checkout">Check-out Date *</Label>
                                        <Input id="checkout" type="date" required />
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="checkoutTime">Departure Time</Label>
                                      <Input id="checkoutTime" type="time" placeholder="--:-- --" />
                                    </div>
                                  </div>

                                  {/* Guest Information */}
                                  <div className="space-y-4">
                                    <h3 className="font-semibold text-foreground">Guest Information</h3>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="adults">Number of Adults</Label>
                                        <Input id="adults" type="number" min="1" defaultValue="1" />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="children">Number of Children</Label>
                                        <Input id="children" type="number" min="0" defaultValue="0" />
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="roomCategory">Room Category</Label>
                                      <Input id="roomCategory" value={room.name} disabled />
                                    </div>
                                  </div>

                                  <p className="text-xs text-muted-foreground">
                                    * Required fields. We'll contact you within 24 hours to confirm your reservation.
                                  </p>

                                  <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white">
                                    Submit Reservation
                                  </Button>
                                </form>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Contact Hotel</h3>
              <div className="space-y-3">
                <a href={`tel:${hotel.contact.phone}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                  <Phone className="w-5 h-5 text-secondary" />
                  {hotel.contact.phone}
                </a>
                <a href={`mailto:${hotel.contact.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                  <Mail className="w-5 h-5 text-secondary" />
                  {hotel.contact.email}
                </a>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-secondary mt-0.5" />
                  <span>{hotel.contact.address}</span>
                </div>
              </div>
            </Card>

            {/* Quick Book */}
            <Card className="p-6 bg-gradient-to-br from-secondary to-secondary/80 text-white">
              <h3 className="text-lg font-bold mb-2">Quick Booking</h3>
              <p className="text-white/80 text-sm mb-4">Ready to book? Select a room and start your reservation.</p>
              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-white text-secondary hover:bg-white/90 font-semibold">
                    Book Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-serif">Make a Reservation</DialogTitle>
                    <DialogDescription>
                      Book your luxury stay at {hotel.name}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form className="space-y-6 py-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Personal Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="sidebar-name">Your Name *</Label>
                        <Input id="sidebar-name" placeholder="Enter your full name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sidebar-phone">Phone Number *</Label>
                        <Input id="sidebar-phone" type="tel" placeholder="+234 xxx xxx xxxx" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sidebar-origin">Where are you coming from? *</Label>
                        <Input id="sidebar-origin" placeholder="City, State, or Country" required />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Stay Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sidebar-checkin">Check-in Date *</Label>
                          <Input id="sidebar-checkin" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sidebar-checkout">Check-out Date *</Label>
                          <Input id="sidebar-checkout" type="date" required />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Guest Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sidebar-adults">Number of Adults</Label>
                          <Input id="sidebar-adults" type="number" min="1" defaultValue="1" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sidebar-children">Number of Children</Label>
                          <Input id="sidebar-children" type="number" min="0" defaultValue="0" />
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      * Required fields. We'll contact you within 24 hours to confirm your reservation.
                    </p>

                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white">
                      Submit Reservation
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}

