import type { HotelUpsertInput } from '@/lib/hotels/types'

function roomImage(base: string) {
  return [`${base}?auto=format&fit=crop&w=1200&q=80`]
}

function hotelImages(...images: string[]) {
  return images.map((image, index) => `${image}?auto=format&fit=crop&w=${1600 - index * 200}&q=80`)
}

export const seededHotels: HotelUpsertInput[] = [
  {
    name: 'Eko Signature Suites',
    location: 'Victoria Island, Lagos',
    description: 'Premium city hotel with executive rooms, rooftop dining, strong business access, and upscale leisure amenities.',
    rating: 4.8,
    reviewCount: 214,
    priceValue: 165000,
    images: hotelImages(
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7'
    ),
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant & Bar', 'Airport Shuttle'],
    contactPhone: '+2347001000001',
    contactEmail: 'bookings@ekosignature.com',
    contactAddress: 'Adetokunbo Ademola Street, Victoria Island, Lagos',
    bankName: 'First Bank',
    bankAccountName: 'Eko Signature Suites',
    bankAccountNumber: '2014567890',
    featured: true,
    status: 'active',
    rooms: [
      {
        name: 'Executive Room',
        description: 'Business-friendly room with work desk, lounge chair, and city-facing windows.',
        priceValue: 165000,
        bedType: 'King Bed',
        size: '38 sqm',
        maxGuests: 2,
        amenities: ['King Bed', 'Desk', 'Smart TV', 'Mini Bar', 'City View'],
        images: roomImage('https://images.unsplash.com/photo-1590490360182-c33d57733427'),
        available: true,
      },
      {
        name: 'Skyline Suite',
        description: 'Large suite with a dedicated sitting area and panoramic views of Victoria Island.',
        priceValue: 285000,
        bedType: 'King Bed',
        size: '68 sqm',
        maxGuests: 3,
        amenities: ['King Bed', 'Living Area', 'Panoramic View', 'Coffee Machine', 'Rain Shower'],
        images: roomImage('https://images.unsplash.com/photo-1584132967334-10e028bd69f7'),
        available: true,
      },
    ],
  },
  {
    name: 'Abuja Grand Hotel',
    location: 'Maitama, Abuja',
    description: 'Modern hospitality experience in Abuja with conference-ready facilities, refined rooms, and convenient access to the city core.',
    rating: 4.6,
    reviewCount: 168,
    priceValue: 120000,
    images: hotelImages(
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'
    ),
    amenities: ['Free WiFi', 'Business Center', 'Meeting Rooms', 'Fitness Center', 'Restaurant', 'Parking'],
    contactPhone: '+2347001000002',
    contactEmail: 'stay@abujagrand.com',
    contactAddress: 'Colorado Close, Maitama, Abuja',
    bankName: 'GTBank',
    bankAccountName: 'Abuja Grand Hotel',
    bankAccountNumber: '0123456789',
    featured: false,
    status: 'active',
    rooms: [
      {
        name: 'Superior King',
        description: 'Comfortable room with premium bedding and streamlined business amenities.',
        priceValue: 120000,
        bedType: 'King Bed',
        size: '30 sqm',
        maxGuests: 2,
        amenities: ['King Bed', 'Desk', 'Coffee Maker', 'Safe'],
        images: roomImage('https://images.unsplash.com/photo-1578683010236-d716f9a3f461'),
        available: true,
      },
      {
        name: 'Conference Suite',
        description: 'Spacious suite for executives with seating area and hosted work meetings.',
        priceValue: 230000,
        bedType: 'King Bed',
        size: '58 sqm',
        maxGuests: 3,
        amenities: ['Meeting Table', 'Lounge Access', 'Mini Bar', 'Large Bathroom'],
        images: roomImage('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'),
        available: true,
      },
    ],
  },
  {
    name: 'Coastline Resort Lekki',
    location: 'Lekki Peninsula, Lagos',
    description: 'Leisure-forward resort offering beachside calm, stylish suites, and family-friendly facilities.',
    rating: 4.7,
    reviewCount: 142,
    priceValue: 210000,
    images: hotelImages(
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c'
    ),
    amenities: ['Private Beach', 'Infinity Pool', 'Water Sports', 'Restaurant & Bar', 'Kids Club', 'Free WiFi'],
    contactPhone: '+2347001000003',
    contactEmail: 'reservations@coastlinelekki.com',
    contactAddress: 'Lekki Peninsula, Lagos',
    bankName: 'Access Bank',
    bankAccountName: 'Coastline Resort Lekki',
    bankAccountNumber: '1029384756',
    featured: true,
    status: 'active',
    rooms: [
      {
        name: 'Ocean Deluxe',
        description: 'Resort room with water-facing balcony and a generous lounging corner.',
        priceValue: 210000,
        bedType: 'Queen Bed',
        size: '42 sqm',
        maxGuests: 2,
        amenities: ['Ocean View', 'Balcony', 'Mini Bar', 'Smart TV'],
        images: roomImage('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
        available: true,
      },
      {
        name: 'Family Retreat Suite',
        description: 'A multi-guest suite designed for family stays with seating and storage space.',
        priceValue: 340000,
        bedType: 'Twin Beds',
        size: '78 sqm',
        maxGuests: 4,
        amenities: ['Twin Beds', 'Family Lounge', 'Beach Access', 'Breakfast Included'],
        images: roomImage('https://images.unsplash.com/photo-1568084680786-a84f91d1153c'),
        available: true,
      },
    ],
  },
]
