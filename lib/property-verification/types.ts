export type PropertyVerificationPackageId = 'basic' | 'standard' | 'premium'
export type PropertyVerificationPaymentStatus = 'pending' | 'paid' | 'failed'
export type PropertyVerificationStatus = 'payment_pending' | 'submitted' | 'in_review' | 'completed' | 'cancelled'

export interface PropertyVerificationPackage {
  id: PropertyVerificationPackageId
  name: string
  priceAmount: number
  priceLabel: string
  turnaround: string
  bestFor: string
  includes: string[]
  outcomes: string[]
  featured?: boolean
}

export interface PropertyVerificationRequestRecord {
  id: string
  trackingCode: string
  propertyId: string | null
  propertyTitle: string
  propertyLocation: string
  propertyAddress: string
  requesterUserId: string | null
  requesterName: string
  requesterEmail: string
  requesterPhone: string
  state: string
  area: string
  goal: string | null
  packageId: PropertyVerificationPackageId
  packageName: string
  amount: number
  paymentReference: string
  paymentStatus: PropertyVerificationPaymentStatus
  verificationStatus: PropertyVerificationStatus
  titleDocumentType: string | null
  titleDocumentUrls: string[]
  surveyPlanUrls: string[]
  additionalDocumentUrls: string[]
  paystackAccessCode: string | null
  paystackAuthorizationUrl: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

export const propertyVerificationPackages: PropertyVerificationPackage[] = [
  {
    id: 'basic',
    name: 'Basic Title Check',
    priceAmount: 29000,
    priceLabel: 'N29,000',
    turnaround: '24-48 hours',
    bestFor: 'Quick verification before paying commitment or inspection fees.',
    includes: [
      'Land registry title search',
      'Certified search report',
      'Document-to-registry match check',
    ],
    outcomes: [
      'Flags fake or inconsistent documents early',
      'Gives quick clarity before committing money',
    ],
  },
  {
    id: 'standard',
    name: 'Standard Due Diligence',
    priceAmount: 49000,
    priceLabel: 'N49,000',
    turnaround: '3-5 business days',
    bestFor: 'Before signing a contract of sale or paying a large deposit.',
    includes: [
      'Survey coordinates verification',
      'Ongoing court case search',
      'Government encumbrance / acquisition status',
      'Land use charge status',
      'Building approval check',
      'Mortgage status verification',
      'Gazette / excision search',
      'Previous owners trace',
      'Probate search',
      'Consolidated verification report',
    ],
    outcomes: [
      'Multi-agency cross-checks',
      'Protects against government acquisition and disputes',
    ],
    featured: true,
  },
  {
    id: 'premium',
    name: 'Premium Full Verification',
    priceAmount: 149000,
    priceLabel: 'N149,000',
    turnaround: '5-7 business days',
    bestFor: 'Full purchase, family land, estates, or any high-value transaction.',
    includes: [
      'Concluded court search (historical judgement)',
      'Community investigation with neighbours and chiefs',
      'Site visit and physical inspection',
    ],
    outcomes: [
      'Maximum legal and physical protection',
      'Confirms documents and real on-ground reality',
    ],
  },
]

export function findPropertyVerificationPackage(id: string) {
  return propertyVerificationPackages.find((item) => item.id === id) || null
}
