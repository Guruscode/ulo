import type { PropertyRecord } from '@/lib/properties/types'
import type { Property } from '@/components/home/types'
import { DEFAULT_PROPERTY_IMAGE, resolveImageUrl } from '@/lib/media/defaults'

export function formatPropertyPrice(property: Pick<PropertyRecord, 'currency' | 'priceValue' | 'pricingPeriod' | 'type'>) {
  const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: property.currency,
    maximumFractionDigits: 0,
  }).format(property.priceValue)

  if (property.pricingPeriod === 'one-time') {
    return formatted
  }

  const periodLabel =
    property.pricingPeriod === 'month'
      ? '/ month'
      : property.pricingPeriod === 'week'
        ? '/ week'
        : '/ day'

  return `${formatted} ${periodLabel}`
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
    sqft: property.sqft.toLocaleString(),
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
    yearBuilt: property.yearBuilt,
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
