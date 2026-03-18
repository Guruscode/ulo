import type { HotelRecord } from '@/lib/hotels/types'

export function formatHotelPrice(priceValue: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(priceValue)
}

export function hotelPrimaryImage(hotel: Pick<HotelRecord, 'images'>) {
  return hotel.images[0] || ''
}
