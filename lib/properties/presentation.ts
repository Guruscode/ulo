import type { PropertyRecord } from '@/lib/properties/types'
import type { Property } from '@/components/home/types'
import { DEFAULT_PROPERTY_IMAGE, resolveImageUrl } from '@/lib/media/defaults'

export function formatPropertyPrice(property: Pick<PropertyRecord, 'currency' | 'priceValue' | 'pricingPeriod' | 'type'>) {
  const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: property.currency,
    maximumFractionDigits: 0,
  }).format(property.priceValue)

  const periodLabels: Record<PropertyRecord['pricingPeriod'], string> = {
    sale: '',
    monthly: '/ month',
    '6-months': '/ 6 months',
    annually: '/ year',
    '2-years': '/ 2 years',
    '5-years': '/ 5 years',
    'per-day': '/ day',
    '3-days': '/ 3 days',
    'per-week': '/ week',
    'per-month': '/ month',
  }

  return periodLabels[property.pricingPeriod]
    ? `${formatted} ${periodLabels[property.pricingPeriod]}`
    : formatted
}

export function toHomeProperty(property: PropertyRecord): Property {
  return {
    id: property.id,
    title: property.title,
    location: property.location,
    fullAddress: property.fullAddress,
    price: formatPropertyPrice(property),
    priceValue: property.priceValue,
    currency: property.currency,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    image: resolveImageUrl(property.imageUrls[0], DEFAULT_PROPERTY_IMAGE),
    images:
      property.imageUrls.length > 0
        ? property.imageUrls.map((imageUrl) => resolveImageUrl(imageUrl, DEFAULT_PROPERTY_IMAGE))
        : [DEFAULT_PROPERTY_IMAGE],
    type: property.type,
    listedBy: property.listedBy,
    estate: property.estate || undefined,
    views: property.viewsCount ?? 0,
    isSaved: property.isSaved ?? false,
    description: property.description,
    features: property.features,
    videoUrl: property.videoUrl,
    referenceCode: property.referenceCode,
    contactName: property.contactName,
    contactPhone: property.contactPhone,
    contactEmail: property.contactEmail,
    verificationStatus: property.verificationStatus,
    approvalStatus: property.approvalStatus,
    status: property.status,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  }
}
